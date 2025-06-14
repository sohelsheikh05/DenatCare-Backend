import express from "express"
import  { body, validationResult } from "express-validator"
import auth from "../middleware/auth.js"
import {getAll,
    getById,
    AddPatient,
    UpdatePatient,
    AddTreatment,
    MarkPatientAsCompleted,
    DeletePatient} from "../controllers/patient.controller.js"
import { get } from "mongoose"
const router = express.Router()

// Get all patients
router.get("/", auth,getAll )

// Get patient by ID
router.get("/:id", auth, getById)

// Create new patient
router.post(
  "/",
  [
    auth,
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("dateOfBirth").isISO8601().withMessage("Please enter a valid date"),
    body("gender").isIn(["male", "female", "other"]).withMessage("Please select a valid gender"),
  ],
    AddPatient
)

// Update patient
router.put("/:id", auth, UpdatePatient)
router.post("/:id/treatments", auth, AddTreatment)

// Mark patient as completed
router.patch("/:id/complete", auth, MarkPatientAsCompleted)

// Delete patient
router.delete("/:id", auth,DeletePatient)

export default router
