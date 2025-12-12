import { z } from 'zod';

const createProduct = {
    body: z.object({
        name: z.string().min(1),
        category: z.string().min(1),
        image: z.string().url().optional(),
        rating: z.number().min(0).max(10).optional(),
        ratingLabel: z.string().optional(),
        servings: z.number().int().positive().optional(),
        pricePerServing: z.number().positive().optional(),
        totalPrice: z.number().positive(),
        currency: z.string().default('$'),
        format: z.string().optional(),
    }),
};

export default {
    createProduct,
};
