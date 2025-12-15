import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import sendEmail from '../utils/sendEmail.js';

const prisma = new PrismaClient();

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const register = async (userData) => {
    const {
        email, password, fullname, phone, dob,
        age, gender, height, weight, averageSleep, dietType,
        activityLevel, habits, caffeineIntake, medicalConditions, currentSupplements
    } = userData;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new ApiError(400, 'Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Assign default USER role (assuming 'USER' role exists from seed)
    const userRole = await prisma.role.findUnique({
        where: { name: 'USER' },
    });

    if (!userRole) {
        throw new ApiError(500, 'Default role not found');
    }

    // Create user
    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            fullname,
            phone,
            dob: dob ? new Date(dob) : undefined,
            age, gender, height, weight, averageSleep, dietType,
            activityLevel, habits, caffeineIntake, medicalConditions, currentSupplements,
            roleId: userRole.id,
            subscriptionPlan: 'FREE',
            subscriptionStatus: 'ACTIVE',
        },
        include: {
            role: true,
        },
    });

    // Remove password from output
    newUser.password = undefined;

    return newUser;
};

const login = async (email, password) => {
    // 1) Check if email and password exist
    if (!email || !password) {
        throw new ApiError(400, 'Please provide email and password');
    }

    // 2) Check if user exists & password is correct
    const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new ApiError(401, 'Incorrect email or password');
    }

    // 3) Generate token
    const token = signToken(user.id);

    user.password = undefined;

    return { user, token };
};

// Generate random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate random reset token
const generateResetToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Send OTP for email verification
const sendVerificationOTP = async (email) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    if (user.isEmailVerified) {
        throw new ApiError(400, 'Email already verified');
    }

    // Generate OTP and expiry (10 minutes)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP to database
    await prisma.user.update({
        where: { email },
        data: {
            emailVerificationOTP: otp,
            otpExpiry: otpExpiry,
        },
    });

    // Send email (import sendEmail utility at top)
    // Uncomment when email is configured
    // await sendEmail({
    //     to: email,
    //     subject: 'Email Verification - OptiStack',
    //     text: `Your verification code is: ${otp}`,
    //     html: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`,
    // });

    return { message: 'OTP sent to email', otp }; // Remove otp from response in production
};

// Verify OTP
const verifyOTP = async (email, otp) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    if (user.isEmailVerified) {
        throw new ApiError(400, 'Email already verified');
    }

    if (!user.emailVerificationOTP || !user.otpExpiry) {
        throw new ApiError(400, 'No OTP found. Please request a new one.');
    }

    if (new Date() > user.otpExpiry) {
        throw new ApiError(400, 'OTP has expired. Please request a new one.');
    }

    if (user.emailVerificationOTP !== otp) {
        throw new ApiError(400, 'Invalid OTP');
    }

    // Mark email as verified and clear OTP
    await prisma.user.update({
        where: { email },
        data: {
            isEmailVerified: true,
            emailVerificationOTP: null,
            otpExpiry: null,
        },
    });

    return { message: 'Email verified successfully' };
};

// Forgot Password - Send 6-digit OTP via email
const forgotPassword = async (email) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        // Don't reveal if user exists or not for security
        return { message: 'If the email exists, a password reset code has been sent.' };
    }

    // Generate 6-digit OTP and expiry (10 minutes)
    const otp = generateOTP();
    const resetExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP to database
    await prisma.user.update({
        where: { email },
        data: {
            passwordResetOTP: otp,
            passwordResetExpiry: resetExpiry,
        },
    });

    // Send email with OTP
    try {
        await sendEmail({
            to: email,
            subject: 'Password Reset Code - OptiStack',
            text: `Your password reset code is: ${otp}. This code will expire in 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>You requested to reset your password. Use the following code to reset your password:</p>
                    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p style="color: #666;">This code will expire in <strong>10 minutes</strong>.</p>
                    <p style="color: #666;">If you didn't request this, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px;">OptiStack - Your Health Optimization Platform</p>
                </div>
            `,
        });
    } catch (error) {
        console.error('Email sending failed:', error);
        // Don't throw error to avoid revealing email existence
    }

    return { message: 'If the email exists, a password reset code has been sent.', otp }; // Remove otp in production
};


// Verify Password Reset OTP
const verifyPasswordResetOTP = async (email, otp) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new ApiError(400, 'Invalid credentials');
    }

    if (!user.passwordResetOTP || !user.passwordResetExpiry) {
        throw new ApiError(400, 'No password reset request found. Please request a new code.');
    }

    if (new Date() > user.passwordResetExpiry) {
        throw new ApiError(400, 'Reset code has expired. Please request a new one.');
    }

    if (user.passwordResetOTP !== otp) {
        throw new ApiError(400, 'Invalid reset code');
    }

    return { message: 'OTP verified successfully' };
};

// Reset Password with OTP
const resetPassword = async (email, otp, newPassword) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new ApiError(400, 'Invalid credentials');
    }

    if (!user.passwordResetOTP || !user.passwordResetExpiry) {
        throw new ApiError(400, 'No password reset request found. Please request a new code.');
    }

    if (new Date() > user.passwordResetExpiry) {
        throw new ApiError(400, 'Reset code has expired. Please request a new one.');
    }

    if (user.passwordResetOTP !== otp) {
        throw new ApiError(400, 'Invalid reset code');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password and clear reset fields
    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            passwordResetOTP: null,
            passwordResetExpiry: null,
        },
    });

    return { message: 'Password reset successfully' };
};

const updateProfile = async (userId, updateBody) => {
    // 1) Verify user exists
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // 2) Check email uniqueness if email is being updated
    if (updateBody.email && updateBody.email !== user.email) {
        const existingEmail = await prisma.user.findUnique({
            where: { email: updateBody.email },
        });
        if (existingEmail) {
            throw new ApiError(400, 'Email already in use');
        }
        // Ideally reset verification status here: updateBody.isEmailVerified = false;
    }

    // 3) Update user
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateBody,
    });

    // Remove password
    updatedUser.password = undefined;

    return updatedUser;
};

export default {
    register,
    login,
    sendVerificationOTP,
    verifyOTP,
    forgotPassword,
    verifyPasswordResetOTP,
    resetPassword,
    updateProfile,
};
