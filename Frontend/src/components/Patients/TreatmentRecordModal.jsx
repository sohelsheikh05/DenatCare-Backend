"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { format } from "date-fns"

const TreatmentRecordModal = ({ open, onClose, patient, onAddTreatment }) => {
  const [newTreatment, setNewTreatment] = useState({
    date: new Date().toISOString().slice(0, 16),
    procedure: "",
    notes: "",
    dentist: "Dr. Johnson",
  })

  const handleChange = (e) => {
    setNewTreatment({
      ...newTreatment,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddTreatment(patient._id, newTreatment)
    setNewTreatment({
      date: new Date().toISOString().slice(0, 16),
      procedure: "",
      notes: "",
      dentist: "Dr. Johnson",
    })
    onClose()
  }

  if (!open || !patient) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Treatment Record: {patient.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Treatment History */}
          <div>
            <h3 className="font-medium mb-3">Treatment History</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {patient.treatments && patient.treatments.length > 0 ? (
                patient.treatments.map((treatment, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{treatment.procedure}</h4>
                      <span className="text-sm text-gray-500">{format(new Date(treatment.date), "PPP")}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{treatment.notes}</p>
                    <p className="text-sm text-gray-500">Dentist: {treatment.dentist}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No treatment records found.</p>
              )}
            </div>
          </div>

          {/* Add New Treatment */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Add New Treatment</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    name="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={newTreatment.date}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dentist</label>
                  <input
                    type="text"
                    name="dentist"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={newTreatment.dentist}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Procedure</label>
                <input
                  type="text"
                  name="procedure"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newTreatment.procedure}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newTreatment.notes}
                  onChange={handleChange}
                  placeholder="Treatment details, observations, follow-up requirements, etc."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
                >
                  Add Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TreatmentRecordModal
