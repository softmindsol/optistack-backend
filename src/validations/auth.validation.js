import { z } from 'zod';

const register = {
    body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
        fullname: z.string().min(1),
        phone: z.string().optional(),
        dob: z.string().optional(),

        // Onboarding
        age: z.number().optional(),
        gender: z.string().optional(),
        height: z.number().optional(),
        weight: z.number().optional(),
        averageSleep: z.number().optional(),
        dietType: z.string().optional(),
        activityLevel: z.string().optional(),
        habits: z.array(z.object({
            type: z.string(),
            frequency: z.string()
        })).optional(),
        caffeineIntake: z.string().optional(),
        medicalConditions: z.array(z.string()).optional(),
        currentSupplements: z.array(z.object({
            name: z.string(),
            category: z.string().optional(),
            image: z.string().optional(),
            rating: z.number().optional(),
            ratingLabel: z.string().optional(),
            servings: z.number().optional(),
            pricePerServing: z.number().optional(),
            totalPrice: z.number().optional(),
            currency: z.string().optional(),
            format: z.string().optional(),
        })).optional(),
    }),
};

const login = {
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    }),
};

const sendOTP = {
    body: z.object({
        email: z.string().email(),
    }),
};

const verifyOTP = {
    body: z.object({
        email: z.string().email(),
        otp: z.string().length(6),
    }),
};

const forgotPassword = {
    body: z.object({
        email: z.string().email(),
    }),
};

const resetPassword = {
    body: z.object({
        email: z.string().email(),
        otp: z.string().length(6),
        newPassword: z.string().min(6),
    }),
};

const verifyPasswordResetOTP = {
    body: z.object({
        email: z.string().email(),
        otp: z.string().length(6),
    }),
};

const updateProfile = {
    body: z.object({
        fullname: z.string().min(1).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        dob: z.string().optional(),
        age: z.number().int().optional(),
        gender: z.string().optional(),
        height: z.number().optional(),
        weight: z.number().optional(),
        healthGoals: z.array(z.string()).optional(),
        // Extra fields in case they want to update them too
        averageSleep: z.number().optional(),
        dietType: z.string().optional(),
        activityLevel: z.string().optional(),
        habits: z.array(z.object({
            type: z.string(),
            frequency: z.string()
        })).optional(),
        caffeineIntake: z.string().optional(),
        medicalConditions: z.array(z.string()).optional(),
        currentSupplements: z.array(z.string()).optional(),
    }),
};

export default {
    register,
    login,
    sendOTP,
    verifyOTP,
    forgotPassword,
    resetPassword,
    verifyPasswordResetOTP,
    updateProfile,
};
