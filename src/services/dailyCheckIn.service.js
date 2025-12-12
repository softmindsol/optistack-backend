import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createCheckIn = async (userId, data) => {
    return await prisma.dailyCheckIn.create({
        data: {
            ...data,
            userId,
        },
    });
};

export default {
    createCheckIn,
};
