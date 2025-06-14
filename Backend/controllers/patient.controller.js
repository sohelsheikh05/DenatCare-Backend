import Patient from "../model/patient.model.js";
import { validationResult } from "express-validator";
const getAll=async(req,res)=>{
    try {
     
    const { status, search } = req.query
    const query = {}
  
    if (status) {
      query.status = status
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ]
    }

    const patients = await Patient.find(query).sort({ lastVisit: -1 })
      
    res.json(patients)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const getById=async(req,res)=>{
 async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" })
    }
    res.json(patient)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}
}

const AddPatient = async (req, res) => {
  try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      console.log(req.body)
      const patient = new Patient(req.body)
      await patient.save()
      res.status(201).json(patient)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
}

const UpdatePatient = async (req, res) => {
 try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" })
    }

    res.json(patient)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const AddTreatment = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" })
    }

    patient.treatments.unshift(req.body)
    patient.lastVisit = req.body.date
    await patient.save()

    res.json(patient)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const MarkPatientAsCompleted = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { status: "Completed", nextAppointment: null },
      { new: true },
    )

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" })
    }

    res.json(patient)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const DeletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id)
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" })
    }
    res.json({ message: "Patient deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

export {
    getAll,
    getById,
    AddPatient,
    UpdatePatient,
    AddTreatment,
    MarkPatientAsCompleted,
    DeletePatient
}