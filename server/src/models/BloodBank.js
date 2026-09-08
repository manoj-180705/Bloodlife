import mongoose from "mongoose";

const bloodBankSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
    },

    bloodStock: {
      "A+": {
        type: Number,
        default: 0,
      },

      "A-": {
        type: Number,
        default: 0,
      },

      "B+": {
        type: Number,
        default: 0,
      },

      "B-": {
        type: Number,
        default: 0,
      },

      "AB+": {
        type: Number,
        default: 0,
      },

      "AB-": {
        type: Number,
        default: 0,
      },

      "O+": {
        type: Number,
        default: 0,
      },

      "O-": {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const BloodBank = mongoose.model(
  "BloodBank",
  bloodBankSchema
);

export default BloodBank;