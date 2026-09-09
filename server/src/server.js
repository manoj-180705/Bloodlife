import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import requestRoutes from "./routes/requestRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bloodBankRoutes from "./routes/bloodBankRoutes.js";


dotenv.config();


const app = express();


const PORT = process.env.PORT || 5000;


/* =========================================
   MIDDLEWARE
========================================= */


/* CORS */

const allowedOrigins = [

  "http://localhost:5173",

  "https://bloodlife-3098.onrender.com",

];


app.use(

  cors({

    origin: function (origin, callback) {

      // Allow requests without origin
      // Example: Postman

      if (!origin) {

        return callback(null, true);

      }


      if (

        allowedOrigins.includes(origin)

      ) {

        return callback(null, true);

      }


      console.log(

        "Blocked by CORS:",

        origin

      );


      return callback(

        new Error("Not allowed by CORS")

      );

    },


    methods: [

      "GET",

      "POST",

      "PUT",

      "DELETE",

      "OPTIONS",

    ],


    allowedHeaders: [

      "Content-Type",

      "Authorization",

    ],

  })

);


/* JSON */

app.use(

  express.json()

);


/* =========================================
   ROUTES
========================================= */


/* DONORS */

app.use(

  "/api/donors",

  donorRoutes

);


/* AUTH */

app.use(

  "/api/auth",

  authRoutes

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

    res.send(

      "BloodLife API is running 🚀"

    );

  }

);


/* =========================================
   START SERVER
========================================= */

const startServer = async () => {

  try {


    /* CHECK ENVIRONMENT VARIABLES */

    if (

      !process.env.MONGODB_URI

    ) {

      throw new Error(

        "MONGODB_URI is missing"

      );

    }


    if (

      !process.env.JWT_SECRET

    ) {

      throw new Error(

        "JWT_SECRET is missing"

      );

    }


    /* CONNECT DATABASE */

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


  } catch (error) {


    console.error(

      "Server startup failed:",

      error.message

    );


    process.exit(1);


  }

};


startServer();