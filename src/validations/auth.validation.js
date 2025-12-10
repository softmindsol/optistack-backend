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
        currentSupplements: z.array(z.string()).optional(),
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

export default {
    register,
    login,
    sendOTP,
    verifyOTP,
    forgotPassword,
    resetPassword,
};
