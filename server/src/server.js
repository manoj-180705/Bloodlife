import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import requestRoutes from "./routes/requestRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bloodBankRoutes from "./routes/bloodBankRoutes.js";


/* =========================================
   LOAD ENV VARIABLES
========================================= */

dotenv.config();


/* =========================================
   CREATE APP
========================================= */

const app = express();


/* =========================================
   PORT
========================================= */

const PORT = process.env.PORT || 5000;


/* =========================================
   CORS
========================================= */

const corsOptions = {

  origin: [
    "http://localhost:5173",

    "http://localhost:3000",

    "https://bloodlife-3098.onrender.com",
  ],

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

};


app.use(cors(corsOptions));


/* =========================================
   HANDLE PREFLIGHT REQUESTS
========================================= */

app.options(
  "*",
  cors(corsOptions)
);


/* =========================================
   MIDDLEWARE
========================================= */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


/* =========================================
   ROUTES
========================================= */

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


/* =========================================
   HOME
========================================= */

app.get("/", (req, res) => {

  res.status(200).send(
    "BloodLife API is running 🚀"
  );

});


/* =========================================
   HEALTH CHECK
========================================= */

app.get(
  "/api/health",

  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        "BloodLife API is running",

    });

  }

);


/* =========================================
   START SERVER
========================================= */

const startServer = async () => {

  try {

    if (!process.env.MONGODB_URI) {

      throw new Error(
        "MONGODB_URI is missing"
      );

    }


    if (!process.env.JWT_SECRET) {

      throw new Error(
        "JWT_SECRET is missing"
      );

    }


    await mongoose.connect(
      process.env.MONGODB_URI
    );


    console.log(
      "MongoDB connected"
    );


    app.listen(
      PORT,
      "0.0.0.0",

      () => {

        console.log(

          `BloodLife server running on port ${PORT}`

        );

      }

    );


  } catch (error) {

    console.error(
      "Server startup failed:",
      error.message
    );

    process.exit(1);

  }

};


startServer();