import { z } from 'zod';

const addToStack = {
    body: z.object({
        // Option 1: Provide existing productId
        productId: z.number().int().positive().optional(),

        // Option 2: Provide full product details (to create on the fly)
        product: z.object({
            name: z.string(),
            category: z.string(),
            image: z.string().optional(),
            rating: z.number().optional(),
            ratingLabel: z.string().optional(),
            servings: z.number().optional(),
            pricePerServing: z.number().optional(),
            totalPrice: z.number(),
            currency: z.string().default('$'),
            format: z.string().optional(),
        }).optional(),

        // Stack/Schedule details
        healthGoal: z.string().optional(),
        isDaily: z.boolean().optional(),
        withFood: z.boolean().optional(),
        morningDose: z.number().int().min(0).optional(),
        midDayDose: z.number().int().min(0).optional(),
        eveningDose: z.number().int().min(0).optional(),
        nightDose: z.number().int().min(0).optional(),
        aiSuggestion: z.string().optional(),
    }).refine((data) => data.productId || data.product, {
        message: "Either productId or product details must be provided",
        path: ["productId", "product"],
    }),
};

const updateStackItem = {
    params: z.object({
        id: z.string().transform((val) => parseInt(val, 10)), // StackItem ID
    }),
    body: z.object({
        healthGoal: z.string().optional(),
        isDaily: z.boolean().optional(),
        withFood: z.boolean().optional(),
        morningDose: z.number().int().min(0).optional(),
        midDayDose: z.number().int().min(0).optional(),
        eveningDose: z.number().int().min(0).optional(),
        nightDose: z.number().int().min(0).optional(),
        aiSuggestion: z.string().optional(),
    }),
};

export default {
    addToStack,
    updateStackItem,
};
