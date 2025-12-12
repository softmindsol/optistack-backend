import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Journal Services
const createJournal = async (userId, data) => {
    return await prisma.journal.create({
        data: {
            ...data,
            userId,
            date: data.date ? new Date(data.date) : new Date(),
        },
    });
};

const getJournals = async (userId) => {
    return await prisma.journal.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
    });
};

// MoodLog Services
const createMoodLog = async (userId, data) => {
    return await prisma.moodLog.create({
        data: {
            ...data,
            userId,
            date: data.date ? new Date(data.date) : new Date(),
        },
    });
};

const getMoodLogs = async (userId) => {
    return await prisma.moodLog.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
    });
};

export default {
    createJournal,
    getJournals,
    createMoodLog,
    getMoodLogs,
};
