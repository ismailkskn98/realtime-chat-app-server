import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import path from "path";
import { __dirname } from "./utils/dirnameAndPathname.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_URL;
const origin = process.env.ORIGIN;

app.use(
  cors({
    origin: [origin, "http://192.168.1.110:5173", "http://192.168.1.103", "https://realtime-chat-app-client-xi.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
console.log(__dirname);
app.use("/static", express.static(path.join(__dirname, "/public")));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

mongoose
  .connect(databaseUrl)
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));
