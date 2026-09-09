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


/* =========================================
   LOAD ENVIRONMENT VARIABLES
========================================= */

const envPath = path.resolve(
  process.cwd(),
  ".env"
);

dotenv.config({
  path: envPath,
});


const PORT = process.env.PORT || 5000;


/* =========================================
   MIDDLEWARE
========================================= */


/* CORS */

const allowedOrigins = [

  "http://localhost:5173",

  process.env.CLIENT_URL,

].filter(Boolean);


app.use(

  cors({

    origin: function (origin, callback) {

      // Allow requests without origin
      // Example: Postman

      if (!origin) {

        return callback(
          null,
          true
        );

      }


      if (
        allowedOrigins.includes(origin)
      ) {

        return callback(
          null,
          true
        );

      }


      console.log(
        "Blocked by CORS:",
        origin
      );


      return callback(

        new Error(
          "Not allowed by CORS"
        )

      );

    },


    methods: [

      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",

    ],


    allowedHeaders: [

      "Content-Type",
      "Authorization",

    ],

  })

);


/* READ JSON BODY */

app.use(
  express.json()
);


/* =========================================
   API ROUTES
========================================= */


/* AUTH */

app.use(
  "/api/auth",
  authRoutes
);


/* DONORS */

app.use(
  "/api/donors",
  donorRoutes
);


/* BLOOD REQUESTS */

app.use(
  "/api/requests",
  requestRoutes
);


/* BLOOD BANKS */

app.use(
  "/api/blood-banks",
  bloodBankRoutes
);


/* =========================================
   TEST ROUTE
========================================= */

app.get(
  "/",
  (req, res) => {

    res.json({

      message:
        "BloodLife API is running 🚀",

    });

  }
);


/* =========================================
   DATABASE + SERVER
========================================= */

const startServer =
  async () => {

    try {


      /* CHECK MONGODB URI */

      if (
        !process.env.MONGODB_URI
      ) {

        throw new Error(

          "MONGODB_URI is missing"

        );

      }


      /* CHECK JWT SECRET */

      if (
        !process.env.JWT_SECRET
      ) {

        throw new Error(

          "JWT_SECRET is missing"

        );

      }


      /* CONNECT MONGODB */

      await mongoose.connect(

        process.env.MONGODB_URI

      );


      console.log(
        "MongoDB connected"
      );


      /* START SERVER */

      app.listen(

        PORT,

        () => {

          console.log(

            `BloodLife server running on port ${PORT}`

          );

        }

      );


    }

    catch (error) {


      console.error(

        "Server startup failed:",

        error.message

      );


      process.exit(1);


    }

  };


startServer();