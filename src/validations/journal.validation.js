import { z } from 'zod';

const createJournal = {
    body: z.object({
        date: z.string().optional(), // ISO Date
        title: z.string().min(1),
        dailyNote: z.string().min(1),
    }),
};

const createMoodLog = {
    body: z.object({
        date: z.string().optional(),
        todayMode: z.string().min(1), // keeping string for flexibility as requested, or matching previous enum
        energyLevel: z.number().int().min(1).max(5),
        dailyNote: z.string().optional(),
    }),
};

export default {
    createJournal,
    createMoodLog,
};
