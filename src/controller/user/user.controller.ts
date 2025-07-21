import express from 'express';
import globalValidator from '../../middleware/globalvalidator/globalValidator';
import { loginUserSchema, registerUserSchema } from '../../utils/validator';
import createAccount from '../../service/userRepository/register/register';
import loginNow from '../../service/userRepository/login/login';
const router = express.Router();
router.post('/create-account', globalValidator(registerUserSchema), createAccount);
router.post('/login', globalValidator(loginUserSchema), loginNow);
export default router;