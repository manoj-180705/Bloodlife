import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();


/* =========================================
   REGISTER
========================================= */

router.post("/register", async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      password,
      bloodGroup,
      location,
    } = req.body;


    /* VALIDATE REQUIRED FIELDS */

    if (!name || !email || !phone || !password) {

      return res.status(400).json({

        message: "Please fill all required fields",

      });

    }


    /* CHECK JWT SECRET */

    if (!process.env.JWT_SECRET) {

      console.error("JWT_SECRET is missing");

      return res.status(500).json({

        message: "Server configuration error",

      });

    }


    /* CHECK EXISTING USER */

    const existingUser =
      await User.findOne({

        email: email.toLowerCase(),

      });


    if (existingUser) {

      return res.status(400).json({

        message: "User already exists with this email",

      });

    }


    /* HASH PASSWORD */

    const hashedPassword =
      await bcrypt.hash(

        password,

        10

      );


    /* CREATE USER */

    const user =
      await User.create({

        name,

        email:
          email.toLowerCase(),

        phone,

        password:
          hashedPassword,

        bloodGroup:
          bloodGroup || "Not Specified",

        location:
          location || "Not Specified",

      });


    /* CREATE JWT TOKEN */

    const token =
      jwt.sign(

        {

          id:
            user._id.toString(),

          email:
            user.email,

        },

        process.env.JWT_SECRET,

        {

          expiresIn:
            "7d",

        }

      );


    /* SUCCESS RESPONSE */

    return res.status(201).json({

      message:
        "Registration successful",

      token,

      user: {

        _id:
          user._id,

        name:
          user.name,

        email:
          user.email,

        phone:
          user.phone,

        bloodGroup:
          user.bloodGroup,

        location:
          user.location,

        lastDonated:
          user.lastDonated,

        isAvailable:
          user.isAvailable,

        donations:
          user.donations,

        points:
          user.points,

        role:
          user.role,

      },

    });


  } catch (error) {


    /* LOG COMPLETE ERROR */

    console.error(
      "Registration error:",
      error
    );


    return res.status(500).json({

      message:
        "Registration failed",

      error:
        error.message,

    });


  }

});


/* =========================================
   LOGIN
========================================= */

router.post("/login", async (req, res) => {

  try {


    const {
      email,
      password,
    } = req.body;


    /* VALIDATE */

    if (!email || !password) {

      return res.status(400).json({

        message:
          "Email and password are required",

      });

    }


    /* CHECK JWT SECRET */

    if (!process.env.JWT_SECRET) {

      console.error(
        "JWT_SECRET is missing"
      );

      return res.status(500).json({

        message:
          "Server configuration error",

      });

    }


    /* FIND USER */

    const user =
      await User.findOne({

        email:
          email.toLowerCase(),

      });


    if (!user) {

      return res.status(401).json({

        message:
          "Invalid email or password",

      });

    }


    /* COMPARE PASSWORD */

    const isPasswordCorrect =
      await bcrypt.compare(

        password,

        user.password

      );


    if (!isPasswordCorrect) {

      return res.status(401).json({

        message:
          "Invalid email or password",

      });

    }


    /* CREATE TOKEN */

    const token =
      jwt.sign(

        {

          id:
            user._id.toString(),

          email:
            user.email,

        },

        process.env.JWT_SECRET,

        {

          expiresIn:
            "7d",

        }

      );


    /* SUCCESS RESPONSE */

    return res.status(200).json({

      message:
        "Login successful",

      token,

      user: {

        _id:
          user._id,

        name:
          user.name,

        email:
          user.email,

        phone:
          user.phone,

        bloodGroup:
          user.bloodGroup,

        location:
          user.location,

        lastDonated:
          user.lastDonated,

        isAvailable:
          user.isAvailable,

        donations:
          user.donations,

        points:
          user.points,

        role:
          user.role,

      },

    });


  } catch (error) {


    console.error(
      "Login error:",
      error
    );


    return res.status(500).json({

      message:
        "Login failed",

      error:
        error.message,

    });


  }

});


export default router;