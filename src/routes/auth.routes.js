import express from 'express';
import authController from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.js';
import authValidation from '../validations/auth.validation.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Authentication routes
router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.get('/me', auth, authController.getMe);

// Email verification routes
router.post('/send-otp', validate(authValidation.sendOTP), authController.sendOTP);
router.post('/verify-otp', validate(authValidation.verifyOTP), authController.verifyOTP);

// Password reset routes
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/verify-password-reset-otp', validate(authValidation.verifyPasswordResetOTP), authController.verifyPasswordResetOTP);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);

export default router;
