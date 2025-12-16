import { z } from 'zod';

const chat = {
    body: z.object({
        message: z.string().min(1, 'Message is required'),
        localHistory: z.array(
            z.object({
                role: z.enum(['user', 'model']),
                parts: z.array(z.object({ text: z.string() }))
            })
        ).optional(),
    }),
};

export default {
    chat,
};
