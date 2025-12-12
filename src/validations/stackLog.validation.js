import { z } from 'zod';

const logStackItem = {
    body: z.object({
        stackItemId: z.number().int().positive(),
        date: z.string().optional(), // ISO Date string (YYYY-MM-DD), defaults to today
        timeSlot: z.enum(['MORNING', 'MID_DAY', 'EVENING', 'NIGHT']),
        status: z.enum(['COMPLETED', 'SKIPPED']).default('COMPLETED'),
    }),
};

const markAllCompleted = {
    body: z.object({
        date: z.string().optional(), // ISO Date string (YYYY-MM-DD)
        timeSlot: z.enum(['MORNING', 'MID_DAY', 'EVENING', 'NIGHT']),
    }),
};

export default {
    logStackItem,
    markAllCompleted,
};
