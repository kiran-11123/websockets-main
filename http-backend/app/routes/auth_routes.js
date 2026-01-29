import express from 'express'
import Authentication_token_function from '../middlewares/Authentication_token.js';
import { SignUpController ,SigninController , deleteUserController} from '../controllers/Auth_Controller.js';
const Auth_Router = express.Router();


Auth_Router.post("/signin" , SigninController);
Auth_Router.post("/signup" , SignUpController)
Auth_Router.post("/delete" , Authentication_token_function ,deleteUserController);





export default Auth_Router;