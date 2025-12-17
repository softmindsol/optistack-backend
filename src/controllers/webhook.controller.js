import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // req.body RAW BUFFER hona chahiye (See Step 4)
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle Events
    switch (event.type) {
        // Case 1: Payment Successful (New or Renewal)
        case 'invoice.payment_succeeded':
            await handleInvoicePaid(event.data.object);
            break;

        // Case 2: Payment Failed (Card Expired/No Funds)
        case 'invoice.payment_failed':
            await handlePaymentFailed(event.data.object);
            break;

        // Case 3: Subscription Deleted (Manually or Automatically)
        case 'customer.subscription.deleted':
            await handleSubscriptionDeleted(event.data.object);
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};

// --- Helper Functions ---

const handleInvoicePaid = async (invoice) => {
    // Invoice se Customer ID aur Subscription ID lo
    const customerId = invoice.customer;
    const subscriptionId = invoice.subscription;

    // Stripe se pucho ke agli expiry kab hai
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const expiryDate = new Date(subscription.current_period_end * 1000);

    // User dhoondo (Metadata se ya Customer ID se)
    // Note: User table me 'stripeCustomerId' unique hona chahiye
    await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
            subscriptionPlan: 'PRO',
            subscriptionStatus: 'ACTIVE',
            subscriptionExpiry: expiryDate, // Stripe wali expiry
            stripeSubscriptionId: subscriptionId
        }
    });

    // Transaction Log karo
    // (Tumhara existing transaction code yahan aayega)
    console.log(`User subscription extended till ${expiryDate}`);
};

const handlePaymentFailed = async (invoice) => {
    const customerId = invoice.customer;
    await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { subscriptionStatus: 'PAST_DUE' }
    });
};

const handleSubscriptionDeleted = async (subscription) => {
    const customerId = subscription.customer;
    await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
            subscriptionPlan: 'FREE',
            subscriptionStatus: 'CANCELLED',
            stripeSubscriptionId: null
        }
    });
};

export default { handleStripeWebhook };