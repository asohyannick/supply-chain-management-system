import express from 'express';
import globalValidator from '../../middleware/globalvalidator/globalValidator';
import { registerUserSchema } from '../../utils/validator';
import createAccount from '../../service/userRepository/register/register';
const router = express.Router();
router.post('/create-account', globalValidator(registerUserSchema), createAccount);
export default router;