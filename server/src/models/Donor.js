import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    bloodGroup: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: "Not Specified",
    },

    // Optional during registration
    lastDonated: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      default: "Available",
    },

    totalDonations: {
      type: Number,
      default: 0,
    },

    coordinates: {
      lat: Number,
      lng: Number,
    },

    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Donor", donorSchema);