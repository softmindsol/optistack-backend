import express from 'express';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import dailyCheckInValidation from '../validations/dailyCheckIn.validation.js';
import dailyCheckInController from '../controllers/dailyCheckIn.controller.js';

const router = express.Router();

router.post('/', auth, validate(dailyCheckInValidation.createCheckIn), dailyCheckInController.createCheckIn);

export default router;
