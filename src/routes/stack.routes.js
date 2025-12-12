import express from 'express';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import stackValidation from '../validations/stack.validation.js';
import stackController from '../controllers/stack.controller.js';

const router = express.Router();

router.use(auth); // All stack routes require auth

router
    .route('/')
    .post(validate(stackValidation.addToStack), stackController.addToStack)
    .get(stackController.getStack);

router
    .route('/:id')
    .patch(validate(stackValidation.updateStackItem), stackController.updateStackItem)
    .delete(stackController.removeFromStack);

export default router;
