import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    bloodGroup: {
      type: String,
      default: "Not Specified",
    },

    location: {
      type: String,
      default: "Not Specified",
      trim: true,
    },

    // Last blood donation date
    lastDonated: {
      type: Date,
      default: null,
    },

    // Automatically becomes true after 90 days
    isAvailable: {
      type: Boolean,
      default: true,
    },

    // Total blood donations
    donations: {
      type: Number,
      default: 0,
    },

    // Reward points
    points: {
      type: Number,
      default: 0,
    },

    profileImage: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["donor", "admin"],
      default: "donor",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);