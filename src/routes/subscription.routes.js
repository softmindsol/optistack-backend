import express from 'express';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import subscriptionValidation from '../validations/subscription.validation.js';
import subscriptionController from '../controllers/subscription.controller.js';

const router = express.Router();

router.use(auth);

// Get current subscription details
router.get('/', subscriptionController.getSubscription);

// Upgrade to PRO
router.post('/upgrade', validate(subscriptionValidation.upgradeSubscription), subscriptionController.upgradeToPro);

// Cancel Subscription
router.post('/cancel', validate(subscriptionValidation.cancelSubscription), subscriptionController.cancelSubscription);

export default router;
