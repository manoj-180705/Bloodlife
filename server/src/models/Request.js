import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    bloodGroup: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    units: {
      type: Number,
      required: true,
      default: 1,
    },

    hospital: {
      type: String,
      default: "",
      trim: true,
    },

    message: {
      type: String,
      default: "",
      trim: true,
    },

    // User who created this blood request
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Request status
    status: {
      type: String,
      enum: [
        "Active",
        "Fulfilled",
        "Cancelled",
      ],
      default: "Active",
    },

    isEmergency: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model(
  "Request",
  requestSchema
);

export default Request;