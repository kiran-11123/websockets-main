import express from 'express'
import { SignUpController ,SigninController } from '../controllers/Auth_Controller.js';
const Auth_Router = express.Router();


Auth_Router.post("/signin" , SigninController);
Auth_Router.post("/signup" , SignUpController)





export default Auth_Router;