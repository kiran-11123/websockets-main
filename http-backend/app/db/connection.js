import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config({ path: "../.env" });

const MONGO_URI = process.env.Mongo_url;

const connectDB = async () => { 

    try{

        await  mongoose.connect(MONGO_URI);

        console.log("DB connected")

    }
    catch(err){
        console.error("Database connection error", err);
        process.exit(1);

    }


}

export default connectDB;