import Appointment from "../model/Appointment.js";
import { validationResult } from "express-validator";
import Patient from "../model/patient.model.js";

// Get all appointments (filtered by admin)
const getAll = async (req, res) => {
  try {
    const { date, status } = req.query;
    const query = { admin_id: req.user._id }; // 👈 Only for this admin

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate("patient", "name email phone avatar")
      .populate("doctor", "name")
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get today's appointments for the admin
const getTodayAppointments = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const appointments = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      admin_id: req.user._id, // 👈 Only today's for this admin
    })
      .populate("patient", "name email phone avatar")
      .sort({ time: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new appointment under the current admin
const newAppointment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const patient = await Patient.findOne({
      _id: req.body.patient,
      admin_id: req.user._id, // 👈 Ensure patient belongs to this admin
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found or not yours" });
    }

    const appointment = new Appointment({
      ...req.body,
      patientName: patient.name,
      doctor: req.user._id,      // logged-in user
      admin_id: req.user._id,    // 👈 assign admin
    });

    await appointment.save();

    // Update patient's next appointment
    patient.nextAppointment = req.body.date;
    await patient.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("patient", "name email phone avatar")
      .populate("doctor", "name");

    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update appointment status only if it belongs to this admin
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, admin_id: req.user._id }, // 👈 Filter by admin
      { status },
      { new: true }
    ).populate("patient", "name email phone avatar");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or not yours" });
    }

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete appointment if owned by current admin
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      admin_id: req.user._id, // 👈 Only delete your own
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or not yours" });
    }

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getAll,
  getTodayAppointments,
  newAppointment,
  updateStatus,
  deleteAppointment,
};
