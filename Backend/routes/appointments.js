import express from "express"
import { body, validationResult } from "express-validator"

import auth from "../middleware/auth.js"
import {getAll, getTodayAppointments, newAppointment, updateStatus, deleteAppointment} from "../controllers/appointment.controller.js"
import authenticateUser from "../middleware/Authenticat.js"
const router = express.Router()

// Get all appointments
router.get("/", auth, authenticateUser,getAll)

// Get today's appointments
router.get("/today", auth, authenticateUser,getTodayAppointments)

// Create new appointment
router.post(
  "/",
  [
    auth,
    body("patient").notEmpty().withMessage("Patient is required"),
    body("date").isISO8601().withMessage("Please enter a valid date"),
    body("time").notEmpty().withMessage("Time is required"),
    body("type").notEmpty().withMessage("Appointment type is required"),
  ],authenticateUser,
  newAppointment
)

// Update appointment status
router.patch("/:id/status", auth, authenticateUser,updateStatus)

// Delete appointment
router.delete("/:id", auth, authenticateUser,deleteAppointment)

export default router
