import * as express from 'express';
import authController from '../controllers/auth.controller';

const authRoute = express.Router();

authRoute.post('/signup', authController.signup);
authRoute.post('/login', authController.login);
authRoute.get('/logout', authController.logout);
export default authRoute;
