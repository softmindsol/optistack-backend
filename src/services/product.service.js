import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createProduct = async (userId, data) => {
    const {
        addToStack,
        healthGoal,
        isDaily,
        morningDose,
        midDayDose,
        eveningDose,
        nightDose,
        aiSuggestion,
        ...productData
    } = data;

    const product = await prisma.product.create({
        data: productData,
    });

    // Automatically add to user's stack
    const stackItem = await prisma.stackItem.create({
        data: {
            userId,
            productId: product.id,
            healthGoal,
            isDaily: isDaily ?? true,
            morningDose: morningDose ?? 0,
            midDayDose: midDayDose ?? 0,
            eveningDose: eveningDose ?? 0,
            nightDose: nightDose ?? 0,
            aiSuggestion,
        },
    });

    return { ...product, stackItemId: stackItem.id, stackItem };
};

const deleteProduct = async (id) => {
    return await prisma.product.delete({
        where: { id },
    });
};

const getProducts = async () => {
    return await prisma.product.findMany();
};

export default {
    createProduct,
    deleteProduct,
    getProducts,
};
