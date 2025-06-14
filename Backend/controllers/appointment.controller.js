import Appointment from "../model/Appointment.js"
import { validationResult } from "express-validator"
import Patient from "../model/patient.model.js"

const getAll=async (req, res) => {
  try {
    const { date, status } = req.query
    const query = {}

    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      query.date = { $gte: startDate, $lt: endDate }
    }

    if (status) {
      query.status = status
    }

    const appointments = await Appointment.find(query)
      .populate("patient", "name email phone avatar")
      .populate("doctor", "name")
      .sort({ date: 1, time: 1 })

    res.json(appointments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const getTodayAppointments=async (req, res) => {
 try {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    const appointments = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate("patient", "name email phone avatar")
      .sort({ time: 1 })

    res.json(appointments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}   

const newAppointment=async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      // Get patient name
      const patient = await Patient.findById(req.body.patient)
  
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" })
      }

      const appointment = new Appointment({
        ...req.body,
        patientName: patient.name,
        doctor: req.userId,
      })

      await appointment.save()

      // Update patient's next appointment
      patient.nextAppointment = req.body.date
      await patient.save()
    
      const populatedAppointment = await Appointment.findById(appointment._id)
        .populate("patient", "name email phone avatar")
        .populate("doctor", "name")

      res.status(201).json(populatedAppointment)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  }


  const updateStatus= async (req, res) => {
  try {
    const { status } = req.body
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate(
      "patient",
      "name email phone avatar",
    )

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    res.json(appointment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const deleteAppointment=async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id)
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }
    res.json({ message: "Appointment deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

export { getAll, getTodayAppointments, newAppointment, updateStatus, deleteAppointment }
