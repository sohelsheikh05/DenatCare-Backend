import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema(
  {
    admin_id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dental_User",
      required: true
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "Dental Cleaning",
        "Root Canal",
        "Cavity Filling",
        "Extraction",
        "Crown Fitting",
        "Braces Adjustment",
        "Consultation",
        "Follow-up",
        "Checkup",
        "Cleaning",
        "Filling",
        "Wisdom Tooth Extraction",
        "Dental Implant Consultation",
      ],
    },
    status: {
      type: String,
      enum: ["Scheduled", "Checked In", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    notes: {
      type: String,
      default: "",
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dental_User",
      required: true,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("Appointment", appointmentSchema)
