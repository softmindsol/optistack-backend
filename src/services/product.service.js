import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createProduct = async (data) => {
    return await prisma.product.create({
        data,
    });
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
