import express from 'express';
import webhookController from '../controllers/webhook.controller.js';

const router = express.Router();

// Stripe requires RAW body for signature verification.
// We apply raw body parsing specifically for this route BEFORE any other json parsing if possible,
// OR if app.js applies json globally, we might need a workaround.
// Ideally, in app.js, we should use: 
// app.use('/api/webhook', express.raw({ type: 'application/json' }));
// app.use(express.json());

router.post('/stripe', webhookController.handleStripeWebhook);

export default router;
