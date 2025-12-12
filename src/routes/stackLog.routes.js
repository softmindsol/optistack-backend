import express from 'express';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import stackLogValidation from '../validations/stackLog.validation.js';
import stackLogController from '../controllers/stackLog.controller.js';

const router = express.Router();

router.use(auth);

router.post('/log', validate(stackLogValidation.logStackItem), stackLogController.logStackItem);
router.post('/log-all', validate(stackLogValidation.markAllCompleted), stackLogController.markAllCompleted);
router.get('/logs', stackLogController.getLogs);

export default router;
