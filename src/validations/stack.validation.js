import { z } from 'zod';

const addToStack = {
    body: z.object({
        productId: z.number().int().positive(),
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
