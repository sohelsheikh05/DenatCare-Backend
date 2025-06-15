"use client"

import { useState, useEffect } from "react"
import { X, Upload, FileText, Download, Trash2, Eye, EyeOff } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

const DocumentsModal = ({ open, onClose, patient }) => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    category: "Other",
    file: null,
  })

  const categories = ["Bill", "Report", "X-Ray", "Prescription", "Insurance", "Other"]

  useEffect(() => {
    if (open && patient) {
      fetchDocuments()
    }
  }, [open, patient])

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + `/documents/patient/${patient._id}`)
      setDocuments(response.data.documents)
      console.log(response)
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast.error("Failed to fetch documents")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB")
        return
      }
      setUploadForm({ ...uploadForm, file })
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!uploadForm.file || !uploadForm.title) {
      toast.error("Please fill in all required fields")
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("document", uploadForm.file)
    formData.append("title", uploadForm.title)
    formData.append("description", uploadForm.description)
    formData.append("category", uploadForm.category)

    try {
      
      await axios.post(import.meta.env.VITE_BACKEND_URL + `/documents/upload/${patient._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Document uploaded successfully")
      setUploadForm({ title: "", description: "", category: "Other", file: null })
      fetchDocuments()
    } catch (error) {
      console.error("Error uploading document:", error)
      toast.error(error.response?.data?.message || "Failed to upload document")
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (documentId, fileName) => {
    try {
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + `/documents/download/${documentId}`, {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading document:", error)
      toast.error("Failed to download document")
    }
  }

  const handleDelete = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return
    }

    try {
      await axios.delete(import.meta.env.VITE_BACKEND_URL + `/documents/${documentId}`)
      toast.success("Document deleted successfully")
      fetchDocuments()
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error("Failed to delete document")
    }
  }

  const toggleVisibility = async (documentId, currentVisibility) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/documents/${documentId}/visibility`, {
        isVisible: !currentVisibility,
      })
      toast.success(`Document ${!currentVisibility ? "shown" : "hidden"} from patient portal`)
      fetchDocuments()
    } catch (error) {
      console.error("Error updating visibility:", error)
      toast.error("Failed to update document visibility")
    }
  }

  

  const getCategoryColor = (category) => {
    const colors = {
      Bill: "bg-red-100 text-red-800",
      Report: "bg-blue-100 text-blue-800",
      "X-Ray": "bg-purple-100 text-purple-800",
      Prescription: "bg-green-100 text-green-800",
      Insurance: "bg-yellow-100 text-yellow-800",
      Other: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors.Other
  }

  if (!open || !patient) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Documents: {patient.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Upload Form */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-4">Upload New Document</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="e.g., Medical Bill - June 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                placeholder="Optional description..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File *</label>
              <input
                type="file"
                required
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, Word, Images, Text files (Max: 10MB)</p>
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Uploading..." : "Upload Document"}
            </button>
          </form>
        </div>

        {/* Documents List */}
        <div>
          <h3 className="font-medium mb-4">Uploaded Documents ({documents.length})</h3>
          {loading ? (
            <div className="text-center py-8">Loading documents...</div>
          ) : documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc._id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-gray-400" />
                      <div>
                        <h4 className="font-medium">{doc.title}</h4>
                        <p className="text-sm text-gray-500">{doc.originalName}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(doc.category)}`}>
                            {doc.category}
                          </span>
                         
                          <span className="text-xs text-gray-500">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        </div>
                        {doc.description && <p className="text-sm text-gray-600 mt-1">{doc.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleVisibility(doc._id, doc.isVisible)}
                        className={`p-2 rounded-md ${
                          doc.isVisible ? "text-green-600 hover:bg-green-100" : "text-gray-400 hover:bg-gray-100"
                        }`}
                        title={doc.isVisible ? "Visible to patient" : "Hidden from patient"}
                      >
                        {doc.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDownload(doc.id, doc.filename)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-md"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No documents uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DocumentsModal
