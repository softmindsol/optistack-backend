import express from 'express';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import aiValidation from '../validations/ai.validation.js';
import aiController from '../controllers/ai.controller.js';

const router = express.Router();

router.use(auth);

// AI Chat Route
router.post('/chat', validate(aiValidation.chat), aiController.handleAIChat);

export default router;
