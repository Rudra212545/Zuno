import dotenv from "dotenv"
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

dotenv.config({ path: './.env' }); // Ensures loading from backend folder

const connectDB = async ()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`\n MongoDB Connected ! `);

    }catch(err){
        console.log("MONGO_DB Connection Failed",err);
        process.exit(1);
    }
}



export default connectDB;