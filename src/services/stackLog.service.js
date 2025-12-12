import { PrismaClient } from '@prisma/client';
import ApiError from '../utils/ApiError.js';

const prisma = new PrismaClient();

const logStackItem = async (userId, data) => {
    const { stackItemId, date, timeSlot, status } = data;

    // Verify ownership
    const stackItem = await prisma.stackItem.findUnique({
        where: { id: stackItemId },
    });

    if (!stackItem) {
        throw new ApiError(404, 'Stack item not found');
    }

    if (stackItem.userId !== userId) {
        throw new ApiError(403, 'Not authorized');
    }

    // Parse date (set to start of day UTC or handle timezone carefully)
    // For simplicity, we'll store specific ISODiate provided or today
    const logDate = date ? new Date(date) : new Date();
    // Normalize to YYYY-MM-DD
    logDate.setHours(0, 0, 0, 0);

    // Upsert log
    return await prisma.stackLog.upsert({
        where: {
            stackItemId_date_timeSlot: {
                stackItemId,
                date: logDate,
                timeSlot,
            },
        },
        update: {
            status,
        },
        create: {
            userId,
            stackItemId,
            date: logDate,
            timeSlot,
            status,
        },
    });
};

const markAllCompleted = async (userId, data) => {
    const { date, timeSlot } = data;

    // Normalize date
    const logDate = date ? new Date(date) : new Date();
    logDate.setHours(0, 0, 0, 0);

    // Get all user's stack items that have a dose for this slot
    // We basically need to iterate and create logs for them.
    // Or we can find which ones need it.

    // Filtering logic: Check if the dose is > 0 for that slot
    let whereClause = { userId };
    if (timeSlot === 'MORNING') whereClause.morningDose = { gt: 0 };
    if (timeSlot === 'MID_DAY') whereClause.midDayDose = { gt: 0 };
    if (timeSlot === 'EVENING') whereClause.eveningDose = { gt: 0 };
    if (timeSlot === 'NIGHT') whereClause.nightDose = { gt: 0 };

    const stackItems = await prisma.stackItem.findMany({
        where: whereClause,
    });

    const logs = [];
    for (const item of stackItems) {
        const log = await prisma.stackLog.upsert({
            where: {
                stackItemId_date_timeSlot: {
                    stackItemId: item.id,
                    date: logDate,
                    timeSlot,
                },
            },
            update: {
                status: 'COMPLETED',
            },
            create: {
                userId,
                stackItemId: item.id,
                date: logDate,
                timeSlot,
                status: 'COMPLETED',
            },
        });
        logs.push(log);
    }

    return logs;
};

const getLogs = async (userId, date) => {
    const queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    return await prisma.stackLog.findMany({
        where: {
            userId,
            date: queryDate,
        },
    });
};

export default {
    logStackItem,
    markAllCompleted,
    getLogs,
};
