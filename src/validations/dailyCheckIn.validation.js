import { z } from 'zod';

const createCheckIn = {
    body: z.object({
        todaysFeeling: z.enum(['GREAT', 'GOOD', 'OKAY', 'LOW', 'ANGRY']),
        didTakeAnythingNew: z.boolean(),
        anySideEffect: z.enum(['NAUSEA', 'ANXIETY', 'FATIGUE', 'HEADACHE', 'JITTERS', 'NO_SIDE_EFFECT']),
        sleepLastNight: z.number().min(1).max(24), // Using 24 just in case, but prompt said 1->10
        sleepQuality: z.number().min(1).max(5),
        energyLevel: z.number().min(1).max(10),
        focus: z.number().min(1).max(10),
        wellnessImpact: z.string(),
    }),
};

export default {
    createCheckIn,
};
