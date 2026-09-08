import bcrypt from "bcryptjs";
import Donor from "../models/Donor.js";

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      bloodGroup,
      location,
      lastDonated,
      password,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !bloodGroup ||
      !location ||
      !password
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const existingUser = await Donor.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const donor = await Donor.create({
      name,
      email,
      phone,
      bloodGroup,
      location,

      lastDonated: lastDonated || null,

      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registration successful",
      donor: {
        id: donor._id,
        name: donor.name,
        email: donor.email,
        bloodGroup: donor.bloodGroup,
        location: donor.location,
        lastDonated: donor.lastDonated,
      },
    });

  } catch (error) {

    console.error(
      "Registration error:",
      error
    );

    res.status(500).json({
      message: "Server error during registration",
    });

  }
};