import { PrismaClient } from '@prisma/client';
import ApiError from '../utils/ApiError.js';

import Stripe from 'stripe';

const prisma = new PrismaClient();
// Initialize Stripe (Ensure STRIPE_SECRET_KEY is in .env)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const getSubscription = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            subscriptionPlan: true,
            subscriptionStatus: true,
            subscriptionExpiry: true,
            transactions: {
                orderBy: { transactionDate: 'desc' },
                take: 5, // Last 5 transactions
            },
        },
    });

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    return user;
};

const upgradeToPro = async (userId, { paymentMethodId }) => {
    // 1. Verify user exists
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Check if already PRO
    if (user.subscriptionPlan === 'PRO' && user.subscriptionStatus === 'ACTIVE') {
        // Optional: Extend subscription instead of erroring?
        // For now, simple error
        if (user.subscriptionExpiry && new Date(user.subscriptionExpiry) > new Date()) {
            throw new ApiError(400, 'User is already on an active PRO plan');
        }
    }

    // 2. Process Payment via Stripe
    // We charge $25.00 (2500 cents)
    const amount = 25.00;
    const amountInCents = 2500;

    let paymentIntent;
    try {
        paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true, // Attempt to charge immediately
            description: `Pro Plan Upgrade - User ${user.email}`,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never', // Simplifies API testing; assumes card works without redirect (3DS)
            },
        });
    } catch (error) {
        throw new ApiError(400, `Payment failed: ${error.message}`);
    }

    if (paymentIntent.status !== 'succeeded') {
        throw new ApiError(400, `Payment not successful. Status: ${paymentIntent.status}`);
    }

    // 3. Create Transaction Record
    const transaction = await prisma.transaction.create({
        data: {
            userId,
            amount,
            currency: 'USD',
            type: 'SUBSCRIPTION_PAYMENT',
            status: 'COMPLETED',
            paymentMethod: 'STRIPE',
            description: `Pro Plan - Monthly (Stripe ID: ${paymentIntent.id})`,
        },
    });

    // 4. Update User Subscription
    // Set expiry to 30 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            subscriptionPlan: 'PRO',
            subscriptionStatus: 'ACTIVE',
            subscriptionExpiry: expiryDate,
        },
        select: {
            subscriptionPlan: true,
            subscriptionStatus: true,
            subscriptionExpiry: true,
        },
    });

    return { subscription: updatedUser, transaction };
};

const cancelSubscription = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    if (user.subscriptionPlan !== 'PRO') {
        throw new ApiError(400, 'User is not on a paid plan');
    }

    // Downgrade immediately or at end of period?
    // Use case: "Cancel" usually sets status to "CANCELLED" but keeps "PRO" until expiry.
    // For simplicity, we will simulate immediate cancellation or just marking status.

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            subscriptionStatus: 'CANCELLED',
            // We keep the plan as PRO until expiry, checking that logical date elsewhere
        },
        select: {
            subscriptionPlan: true,
            subscriptionStatus: true,
            subscriptionExpiry: true,
        },
    });

    return updatedUser;
};

export default {
    getSubscription,
    upgradeToPro,
    cancelSubscription,
};
