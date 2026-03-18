import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

// credentials:true required — lets browser send httpOnly cookies cross-origin
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Connect to DB before starting the server
connectDB().then(() => {
  app.use("/api/auth", authRoutes);

  app.listen(process.env.PORT || 3000, () =>
    console.log(`Server running on port ${process.env.PORT || 3000}`),
  );
});
