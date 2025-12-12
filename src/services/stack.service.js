import { PrismaClient } from '@prisma/client';
import ApiError from '../utils/ApiError.js';

const prisma = new PrismaClient();

const addToStack = async (userId, data) => {
    // Check if product exists
    const product = await prisma.product.findUnique({
        where: { id: data.productId },
    });

    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    // Check if already in stack
    const existingItem = await prisma.stackItem.findUnique({
        where: {
            userId_productId: {
                userId,
                productId: data.productId,
            },
        },
    });

    if (existingItem) {
        throw new ApiError(400, 'Product already in stack');
    }

    return await prisma.stackItem.create({
        data: {
            ...data,
            userId,
        },
        include: {
            product: true,
        },
    });
};

const getStack = async (userId) => {
    return await prisma.stackItem.findMany({
        where: { userId },
        include: {
            product: true,
        },
    });
};

const updateStackItem = async (userId, id, data) => {
    const stackItem = await prisma.stackItem.findUnique({
        where: { id },
    });

    if (!stackItem) {
        throw new ApiError(404, 'Stack item not found');
    }

    if (stackItem.userId !== userId) {
        throw new ApiError(403, 'Not authorized');
    }

    return await prisma.stackItem.update({
        where: { id },
        data,
        include: {
            product: true,
        },
    });
};

const removeFromStack = async (userId, id) => {
    const stackItem = await prisma.stackItem.findUnique({
        where: { id },
    });

    if (!stackItem) {
        throw new ApiError(404, 'Stack item not found');
    }

    if (stackItem.userId !== userId) {
        throw new ApiError(403, 'Not authorized');
    }

    return await prisma.stackItem.delete({
        where: { id },
    });
};

export default {
    addToStack,
    getStack,
    updateStackItem,
    removeFromStack,
};
