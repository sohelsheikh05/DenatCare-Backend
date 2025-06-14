import mongoose from "mongoose"

const treatmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  procedure: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: "",
  },
  dentist: {
    type: String,
    required: true,
  },
})

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
    medicalHistory: {
      type: String,
      default: "",
    },
    lastVisit: {
      type: Date,
      default: Date.now,
    },
    nextAppointment: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Active", "Completed"],
      default: "Active",
    },
    treatments: [treatmentSchema],
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("Patient", patientSchema)
