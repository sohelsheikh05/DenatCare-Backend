import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Document from '../model/Document.js';
import Patient from '../model/patient.model.js';
import auth from '../middleware/auth.js';
import authenticateUser from '../middleware/Authenticat.js';
import { title } from 'process';

const router = express.Router();
const __dirname = path.resolve();
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    
    const uploadPath = path.join(__dirname, '../uploads/documents');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow specific file types
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images, PDFs, and documents are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});

// Upload document
router.post('/upload/:patientId', auth, authenticateUser,upload.single('document'), async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
      const patientId = req.params.patientId;
    const {  documentType, description, category,title } = req.body;
     
    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Create document record
    const document = new Document({
      title: title,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      patientId: patientId,
      documentType: documentType ,
      description: description ,
      category: category || 'medical',
      uploadedBy: req.user.id,
      uploadedAt: new Date()
    });

    await document.save();

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: {
        id: document._id,
        filename: document.originalName,
        documentType: document.documentType,
        category: document.category,
        description: document.description,
        uploadedAt: document.uploadedAt,
        size: document.size
      }
    });

  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ message: 'Failed to upload document' });
  }
});

// Get patient documents
router.get('/patient/:patientId', auth, async (req, res) => {
  try {

    const { patientId } = req.params;
    const { category, documentType } = req.query;

    let query = { patientId: patientId };
    
    if (category) query.category = category;
    if (documentType) query.documentType = documentType;

    const documents = await Document.find(query)
      .populate('uploadedBy', 'name')
      .sort({ uploadedAt: -1 });
   
    const documentsWithUrls = documents.map(doc => ({
      title: doc.title,
      id: doc._id,
      filename: doc.originalName,
      documentType: doc.documentType,
      category: doc.category,
      description: doc.description,
      uploadedAt: doc.uploadedAt,
      uploadedBy: doc.uploadedBy?.name || 'Unknown',
      size: doc.size,
      downloadUrl: `/api/documents/download/${doc._id}`
    }));

    res.json({
      documents: documentsWithUrls,
      total: documentsWithUrls.length
    });

  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Failed to retrieve documents' });
  }
});

// Download document
router.get('/download/:documentId', auth, async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if file exists
    if (!fs.existsSync(document.path)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
    res.setHeader('Content-Type', document.mimetype);

    // Stream the file
    const fileStream = fs.createReadStream(document.path);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Document download error:', error);
    res.status(500).json({ message: 'Failed to download document' });
  }
});

// Delete document
router.delete('/:documentId', auth, async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(document.path)) {
      fs.unlinkSync(document.path);
    }

    // Delete document record
    await Document.findByIdAndDelete(documentId);

    res.json({ message: 'Document deleted successfully' });

  } catch (error) {
    console.error('Document delete error:', error);
    res.status(500).json({ message: 'Failed to delete document' });
  }
});

// Get document categories and types
router.get('/metadata', auth, async (req, res) => {
  try {
    const categories = [
      'medical',
      'insurance',
      'lab-results',
      'prescriptions',
      'imaging',
      'referrals',
      'other'
    ];

    const documentTypes = [
      'medical-record',
      'lab-report',
      'prescription',
      'insurance-card',
      'x-ray',
      'mri',
      'ct-scan',
      'referral-letter',
      'discharge-summary',
      'vaccination-record',
      'other'
    ];

    res.json({
      categories,
      documentTypes
    });

  } catch (error) {
    res.status(500).json({ message: 'Failed to get metadata' });
  }
});

export default router;