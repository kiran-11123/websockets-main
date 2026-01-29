import express from 'express'
import Authentication_token_function from '../middlewares/Authentication_token.js';

const Room_Router = express.Router();


import { CreateRoomController , DeleteRoomController ,  exitingRoomController} from '../controllers/Room_Controller.js';

Room_Router.post("/create-room" , Authentication_token_function , CreateRoomController);
Room_Router.post("/delete-room" , Authentication_token_function , DeleteRoomController);
Room_Router.post("/exit-room" , Authentication_token_function , exitingRoomController);



export default Room_Router;