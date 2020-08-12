import express from 'express';
import AuthMiddleware from '../../middleware/auth/auth';
import AuthController from '../../controllers/auth';


const { signup, signin } = AuthController;
const {
  validatSignUpFields,
  signUpEmailValidator,
  validateLoginField,
  loginEmailValidator,
} = AuthMiddleware;
const router = express.Router();

/* GET users listing. */
router.post('/signup', validatSignUpFields, signUpEmailValidator, signup);
router.post('/login', validateLoginField, loginEmailValidator, signin);

export default router;
