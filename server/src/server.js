import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import requestRoutes from "./routes/requestRoutes.js";

import donorRoutes from "./routes/donorRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bloodBankRoutes from "./routes/bloodBankRoutes.js";

const app = express();

const envPath = path.resolve(
  process.cwd(),
  ".env"
);

dotenv.config({
  path: envPath,
});

const PORT = process.env.PORT || 5000;


/* MIDDLEWARE */

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",
  })
);

app.use(express.json());


/* ROUTES */

app.use(
  "/api/donors",
  donorRoutes
);

app.use(
  "/api/auth",
  authRoutes
);
app.use(
  "/api/requests",
  requestRoutes
);
app.use(
  "/api/blood-banks",
  bloodBankRoutes
);

app.get("/", (req, res) => {
  res.send("BloodLife API is running 🚀");
});

/* DATABASE + SERVER */

const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing from .env"
      );
    }

    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(
        `BloodLife server running on http://localhost:${PORT}`
      );
    });

  } catch (error) {

    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};

startServer();