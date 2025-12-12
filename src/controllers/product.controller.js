import productService from '../services/product.service.js';
import catchAsync from '../utils/catchAsync.js';

const createProduct = catchAsync(async (req, res) => {
    const product = await productService.createProduct(req.body);
    res.status(201).send(product);
});

const deleteProduct = catchAsync(async (req, res) => {
    await productService.deleteProduct(parseInt(req.params.id));
    res.status(204).send();
});

const getProducts = catchAsync(async (req, res) => {
    const products = await productService.getProducts();
    res.send(products);
});

export default {
    createProduct,
    deleteProduct,
    getProducts,
};
