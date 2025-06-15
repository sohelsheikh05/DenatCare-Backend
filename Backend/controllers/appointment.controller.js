import Appointment from "../model/Appointment.js";
import { validationResult } from "express-validator";
import Patient from "../model/patient.model.js";


const getAll = async (req, res) => {
  try {
    const { date, status } = req.query;
    const query = { admin_id: req.user._id }; 

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


const newAppointment = async (req, res) => {
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {date, time} = req.body
       const appointmentDate = new Date(date);
    const appointmentTimeParts = time.split(":");
    appointmentDate.setHours(parseInt(appointmentTimeParts[0]), parseInt(appointmentTimeParts[1]), 0, 0);

    const now = new Date();

    if (appointmentDate < now) {
      return res.status(400).json({ message: "Appointment must be scheduled for a future date and time." });
    }
    const patient = await Patient.findOne({
      _id: req.body.patient,
      admin_id: req.user._id, 
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found or not yours" });
    }

    

    const date1 = new Date(`1970-01-01T${time}:00`);
date1.setMinutes(date1.getMinutes() + 30);
const endTime = date1.toTimeString().slice(0, 5);  // Upper limit (time + 30 min)

const date2 = new Date(`1970-01-01T${time}:00`);
date2.setMinutes(date2.getMinutes() - 30);
const startTime = date2.toTimeString().slice(0, 5); // Lower limit (time - 30 min)

// Fetch all appointments on that date
const appointmentsOnSameDate = await Appointment.find({ date: date });

// Check for conflict
const conflict = appointmentsOnSameDate.find((appointment) => {
  const existingTime = appointment.time; // Assuming format "HH:mm"
  return existingTime >= startTime && existingTime <= endTime;
});

if (conflict) {
  return res.status(410).json({ message: "Conflict: An appointment exists within 30 minutes of this time." });
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
    patient.status==="Completed"?patient.status="Active":patient.status
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
