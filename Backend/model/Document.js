import mongoose from "mongoose"
import { title } from "process";

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  documentType: {
    type: String,
    enum: [
      'Bill',
      'Report', 
      'Prescription',
      'insurance',
      'X-Ray',
      'mri',
      'ct-scan',
      'referral-letter',
      'discharge-summary',
      'vaccination-record',
      'other',

    ],
    default: 'other'
  },
  category: {
    type: String,
    enum: [
      'medical',
      'Insurance', 
      'lab-results',
      'Prescriptions',
      'imaging',
      'referrals',
      'other',
      'Bill',
      'X-Ray',
      'Report',

    ],
    default: 'medical'
  },
  description: {
    type: String,
    default: ''
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dental_User',
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model('Document', documentSchema);