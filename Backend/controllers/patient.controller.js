import Patient from "../model/patient.model.js";
import { validationResult } from "express-validator";

// Get all patients for logged-in user, with optional filters
const getAll = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = { admin_id: req.user._id }; // Filter by logged-in user

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const patients = await Patient.find(query).sort({ lastVisit: -1 });
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get patient by id, only if owned by logged-in user
const getById = async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id, admin_id: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found or access denied" });
    }
    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add new patient, assign admin_id to logged-in user
const AddPatient = async (req, res) => {
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Attach admin_id from logged-in user
    const patientData = { ...req.body, admin_id: req.user._id };
    console.log("Patient data:", patientData);
    const patient = new Patient(patientData);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update patient only if owned by logged-in user
const UpdatePatient = async (req, res) => {
  try {
    // Find patient by id and admin_id
    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id, admin_id: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found or access denied" });
    }

    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add treatment to patient if owned by logged-in user
const AddTreatment = async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id, admin_id: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found or access denied" });
    }

    patient.treatments.unshift(req.body);
    patient.lastVisit = req.body.date;
    await patient.save();

    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark patient as completed if owned by logged-in user
const MarkPatientAsCompleted = async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id, admin_id: req.user._id },
      { status: "Completed", nextAppointment: null },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found or access denied" });
    }

    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete patient only if owned by logged-in user
const DeletePatient = async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({ _id: req.params.id, admin_id: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found or access denied" });
    }
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getAll,
  getById,
  AddPatient,
  UpdatePatient,
  AddTreatment,
  MarkPatientAsCompleted,
  DeletePatient,
};
