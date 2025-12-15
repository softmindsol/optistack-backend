import subscriptionService from '../services/subscription.service.js';
import catchAsync from '../utils/catchAsync.js';

const getSubscription = catchAsync(async (req, res) => {
    const subscription = await subscriptionService.getSubscription(req.user.id);
    res.status(200).json({
        status: 'success',
        data: subscription,
    });
});

const upgradeToPro = catchAsync(async (req, res) => {
    const result = await subscriptionService.upgradeToPro(req.user.id, req.body);
    res.status(200).json({
        status: 'success',
        message: 'Successfully upgraded to PRO plan',
        data: result,
    });
});

const cancelSubscription = catchAsync(async (req, res) => {
    const subscription = await subscriptionService.cancelSubscription(req.user.id);
    res.status(200).json({
        status: 'success',
        message: 'Subscription cancelled successfully',
        data: subscription,
    });
});

export default {
    getSubscription,
    upgradeToPro,
    cancelSubscription,
};
