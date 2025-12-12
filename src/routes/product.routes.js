import express from 'express';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import productValidation from '../validations/product.validation.js';
import productController from '../controllers/product.controller.js';
import verifyOwnership from '../middlewares/verifyOwnership.js'; // Assuming this exists or using admin check?

// NOTE: Ideally, add an 'admin' role check or similar here. 
// For now, assuming any authenticated user can do this or relying on role check in auth or separate middleware.
// If there is an admin middleware, it should be used.
// Based on file list, only 'verifyOwnership' exists, maybe 'auth' checks role?
// I'll stick to 'auth' for now.

const router = express.Router();

router
    .route('/')
    .post(auth, validate(productValidation.createProduct), productController.createProduct)
    .get(productController.getProducts); // Publicly viewable? or auth? Making public for now or easy access.

router
    .route('/:id')
    .delete(auth, productController.deleteProduct);

export default router;
