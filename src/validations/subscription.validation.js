import { z } from 'zod';

const upgradeSubscription = {
    body: z.object({
        paymentMethodId: z.string({ required_error: "Payment Method ID is required" }),
    }),
};

const cancelSubscription = {
    body: z.object({
        reason: z.string().optional(),
    }),
};

export default {
    upgradeSubscription,
    cancelSubscription,
};
