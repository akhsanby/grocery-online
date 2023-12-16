import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { publicRouter } from "../routes/public-api.js";
import { userRouter } from "../routes/api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";

export const web = express();
web.use(express.json());
web.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    origin: true,
  })
);
web.use(cookieParser());

web.use(publicRouter);
web.use(userRouter);
web.use(errorMiddleware);
