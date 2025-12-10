import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import { PrismaClient } from '@prisma/client';

const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
