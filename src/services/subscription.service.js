import { PrismaClient } from '@prisma/client';
import ApiError from '../utils/ApiError.js';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1. Get Subscription Details
const getSubscription = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            subscriptionPlan: true,
            subscriptionStatus: true,
            subscriptionExpiry: true,
            stripeCustomerId: true, // TODO: Uncomment after running migration
        },
    });

    if (!user) throw new ApiError(404, 'User not found');
    return user;
};

// 2. Upgrade to Pro (Create Recurring Subscription)
const upgradeToPro = async (userId, { paymentMethodId }) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(404, 'User not found');

    // A. Customer Creation (Agar pehle se nahi hai)
    let customerId = user.stripeCustomerId;

    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            name: user.fullname,
            metadata: { userId: userId.toString() }
        });
        customerId = customer.id;

        // DB update karo taake next time naya customer na bane
        await prisma.user.update({
            where: { id: userId },
            data: { stripeCustomerId: customerId }
        });
    }

    // B. Attach Payment Method to Customer
    try {
        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: customerId,
        });

        // Is card ko default bana do
        await stripe.customers.update(customerId, {
            invoice_settings: { default_payment_method: paymentMethodId },
        });
    } catch (error) {
        throw new ApiError(400, `Card Error: ${error.message}`);
    }

    // C. Create Subscription (Asli Recurring Logic)
    try {
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: process.env.STRIPE_PRICE_ID_MONTHLY }], // .env se Price ID lo
            expand: ['latest_invoice.payment_intent'],

            metadata: { userId: userId.toString(), type: 'SUBSCRIPTION_UPGRADE' }
        });

        // Status check karo
        const status = subscription.status; // active, incomplete, trialing
        const clientSecret = subscription.latest_invoice.payment_intent?.client_secret;

        return {
            subscriptionId: subscription.id,
            status: status,
            clientSecret: clientSecret, // Frontend ko chahiye agar 3D secure (OTP) ki zaroorat ho
            message: 'Subscription created. Waiting for payment confirmation.'
        };

    } catch (error) {
        throw new ApiError(400, `Subscription Failed: ${error.message}`);
    }
};

// 3. Cancel Subscription (Stripe se cancel karo)
const cancelSubscription = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.stripeSubscriptionId) {
        throw new ApiError(400, 'No active subscription found to cancel.');
    }

    try {
        // Cancel at period end (User ne paise diye hain to mahina pura hone do)
        const deletedSubscription = await stripe.subscriptions.update(
            user.stripeSubscriptionId,
            { cancel_at_period_end: true }
        );

        return {
            message: 'Subscription will be cancelled at the end of the billing period.',
            cancelAt: new Date(deletedSubscription.cancel_at * 1000)
        };
    } catch (error) {
        throw new ApiError(500, `Stripe Error: ${error.message}`);
    }
};

export default {
    getSubscription,
    upgradeToPro,
    cancelSubscription,
};