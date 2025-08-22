import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from './utils/errorMiddleware.js';


const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser());
app.use(errorHandler);

// Routes Import
import userRouter from "./routes/user.routes.js"
import serverRouter from "./routes/server.route.js"
import channelRouter from "./routes/channel.route.js";
import messageRouter from "./routes/message.route.js";
import channelReadRouter from "./routes/channelRead.route.js";
import inviteRouter from "./routes/invite.route.js";



// router decleration
// http://localhost:3000/api/v1/users/register - 1st route 
app.use("/api/v1/users",userRouter);
app.use("/api/v1/server",serverRouter);
app.use("/api/v1/channels", channelRouter);
app.use('/api/v1/messages', messageRouter);
app.use('/api/v1/channelRead', channelReadRouter);
app.use('/api/v1/invites',inviteRouter);




app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
  
    res.status(statusCode).json({
      success: err.success || false,
      message: err.message || 'Something went wrong',
      errors: err.errors || null,
      field: err.field || null
    });
  });
  

export { app } 
