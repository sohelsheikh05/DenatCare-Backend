"use client"

import { useState } from "react"
import { X } from "lucide-react"

const ScheduleAppointmentModal = ({ open, onClose, patient, onScheduleAppointment }) => {
  const [formData, setFormData] = useState({
    date: "",
    time: "10:00",
    type: "",
    notes: "",
  })

  const appointmentTypes = [
    "Dental Cleaning",
    "Root Canal",
    "Cavity Filling",
    "Extraction",
    "Crown Fitting",
    "Braces Adjustment",
    "Consultation",
    "Follow-up",
    "Checkup",
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onScheduleAppointment(patient._id, formData)
    setFormData({
      date: "",
      time: "10:00",
      type: "",
      notes: "",
    })
    onClose()
  }

  if (!open || !patient) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Schedule Appointment: {patient.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date</label>
            <input
              type="date"
              name="date"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Time</label>
            <input
              type="time"
              name="time"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={formData.time}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
            <select
              name="type"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="">Select appointment type</option>
              {appointmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional information about the appointment"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
            >
              Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ScheduleAppointmentModal
