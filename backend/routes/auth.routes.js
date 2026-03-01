import express from 'express';
import { signup, login, logout, verifyEmail, sendCodeAgain, forgotPassword, resetPassword  } from '../controllers/auth.controller.js';
import { validate } from "../middleware/validate.middleware.js";
import { signupSchema, loginSchema } from "../validators/auth.validator.js";
const router = express.Router();


router.post('/signup', validate(signupSchema), signup);
router.post('/verify-email', verifyEmail);
router.post('/send-code-again', sendCodeAgain);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/logout', logout);

export default router;