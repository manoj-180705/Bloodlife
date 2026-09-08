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


    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }


    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });


    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }


    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );


    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      bloodGroup: bloodGroup || "Not Specified",
      location: location || "Not Specified",
    });


    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );


    res.status(201).json({
      message: "Registration successful",

      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        location: user.location,
        lastDonated: user.lastDonated,
        isAvailable: user.isAvailable,
        donations: user.donations,
        points: user.points,
        role: user.role,
      },
    });

  } catch (error) {

    console.error(
      "Registration error:",
      error
    );

    res.status(500).json({
      message: "Registration failed",
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


    // Validate
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }


    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    });


    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }


    // Compare password
    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }


    // Create token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );


    res.status(200).json({

      message: "Login successful",

      token,

      user: {

        _id: user._id,

        name: user.name,

        email: user.email,

        phone: user.phone,

        bloodGroup: user.bloodGroup,

        location: user.location,

        lastDonated: user.lastDonated,

        isAvailable: user.isAvailable,

        donations: user.donations,

        points: user.points,

        role: user.role,

      },

    });

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    res.status(500).json({
      message: "Login failed",
    });

  }

});


export default router;