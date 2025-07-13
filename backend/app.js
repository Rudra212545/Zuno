import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from './utils/errorMiddleware.js';


const app = express();


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser());
app.use(errorHandler);

// Routes Import
import userRouter from "./routes/user.routes.js"


// router decleration
// http://localhost:3000/api/v1/users/register - 1st route 
app.use("/api/v1/users",userRouter);





export { app } 
