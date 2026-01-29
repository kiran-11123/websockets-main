import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import cors from 'cors'
import Auth_Router from './app/routes/auth_routes.js';
import Room_Router from './app/routes/room_routes.js';



dotenv.config({ path: "../.env" });
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/api/users" , Auth_Router);
app.use("/api/rooms" , Room_Router);

app.listen(process.env.PORT , ()=>{
    console.log(`Http server is running on port ${process.env.PORT}`)
})