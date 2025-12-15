import authService from '../services/auth.service.js';
import catchAsync from '../utils/catchAsync.js';

const register = catchAsync(async (req, res) => {
    const user = await authService.register(req.body);
    res.status(201).json({
        status: 'success',
        data: { user },
    });
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    res.status(200).json({
        status: 'success',
        token,
        data: { user },
    });
});

const getMe = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user,
        },
    });
};

const sendOTP = catchAsync(async (req, res) => {
    const { email } = req.body;
    const result = await authService.sendVerificationOTP(email);

    res.status(200).json({
        status: 'success',
        message: result.message,
        data: { otp: result.otp }, // Remove in production
    });
});

const verifyOTP = catchAsync(async (req, res) => {
    const { email, otp } = req.body;
    const result = await authService.verifyOTP(email, otp);

    res.status(200).json({
        status: 'success',
        message: result.message,
    });
});

const forgotPassword = catchAsync(async (req, res) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);

    res.status(200).json({
        status: 'success',
        message: result.message,
        data: { resetToken: result.resetToken }, // Remove in production
    });
});


const verifyPasswordResetOTP = catchAsync(async (req, res) => {
    const { email, otp } = req.body;
    const result = await authService.verifyPasswordResetOTP(email, otp);

    res.status(200).json({
        status: 'success',
        message: result.message,
    });
});

const resetPassword = catchAsync(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const result = await authService.resetPassword(email, otp, newPassword);

    res.status(200).json({
        status: 'success',
        message: result.message,
    });
});

const updateProfile = catchAsync(async (req, res) => {
    const user = await authService.updateProfile(req.user.id, req.body);
    res.status(200).json({
        status: 'success',
        data: { user },
    });
});

export default {
    register,
    login,
    getMe,
    sendOTP,
    verifyOTP,
    forgotPassword,
    verifyPasswordResetOTP,
    resetPassword,
    updateProfile,
};
