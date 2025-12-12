import { PrismaClient } from '@prisma/client';
import ApiError from '../utils/ApiError.js';

const prisma = new PrismaClient();

const addToStack = async (userId, data) => {
    let productId = data.productId;
    let productDetails = data.product;

    if (productId) {
        // Option 1: Using existing Product ID
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new ApiError(404, 'Product not found');
        }
    } else if (productDetails) {
        // Option 2: Creating new Product from details
        // Check if name already exists to avoid duplication? 
        // For now, assuming we always create (or we could try to find first)
        // User asked to "Keep productId in stack", implies creating a record.
        const newProduct = await prisma.product.create({
            data: productDetails,
        });
        productId = newProduct.id;
    } else {
        throw new ApiError(400, 'Product ID or details required');
    }

    // Check if linked already
    const existingItem = await prisma.stackItem.findUnique({
        where: {
            userId_productId: {
                userId,
                productId,
            },
        },
    });

    if (existingItem) {
        throw new ApiError(400, 'Product already in stack');
    }

    // Clean data for StackItem (remove 'product')
    const { product: _p, productId: _pid, ...stackData } = data;

    return await prisma.stackItem.create({
        data: {
            ...stackData,
            userId,
            productId,
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
