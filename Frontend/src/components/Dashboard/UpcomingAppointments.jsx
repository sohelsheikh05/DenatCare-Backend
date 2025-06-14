"use client"

import { useState, useEffect } from "react"
import { Clock, MoreHorizontal, Phone, Send, User } from "lucide-react"
import { format } from "date-fns"
import axios from "axios"
import toast from "react-hot-toast"

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  useEffect(() => {
    fetchTodayAppointments()
  }, [])

  const fetchTodayAppointments = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/appointments/today")
      
       const filtered = response.data.filter(app => app.status !== "Cancelled")
    setAppointments(filtered)
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast.error("Failed to fetch appointments")
    } finally {
      setLoading(false)
    }
  }

 
  const handleSendReminder = async (appointment) => {
    try {
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/reminders/send-reminder", {
        patientName: appointment.patientName,
        phone: appointment.patient?.phone,
        email: appointment.patient?.email,
        appointmentTime: `${format(new Date(appointment.date), "PPP")} at ${appointment.time}`,
        appointmentType: appointment.type,
      })
      toast.success(`Reminder sent to ${appointment.patientName}`)
    } catch (error) {
      console.error("Error sending reminder:", error)
      toast.error("Failed to send reminder")
    }
  }

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/appointments/${appointmentId}/status`, {
        status: newStatus,
      })
      fetchTodayAppointments()
      toast.success("Appointment status updated")
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update status")
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading appointments...</div>
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No appointments scheduled for today</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {appointments.map((appointment, index) => (
        <div
          key={appointment._id}
          className="flex items-center justify-between rounded-lg border p-3 text-sm relative"
        >
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-600 font-medium">
                {appointment.patientName?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium">{appointment.patientName}</p>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="mr-1 h-3 w-3" />
                {appointment.time}
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <p className="font-medium">{appointment.type}</p>
            <p className="text-xs text-gray-500">Today</p>
          </div>

          <div className="flex items-center relative">
            <span
              className={`mr-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                appointment.status === "Checked In"
                  ? "bg-green-100 text-green-800"
                  : appointment.status === "Completed"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {appointment.status}
            </span>

            <div className="relative">
              <button
                className="p-1 hover:bg-gray-100 rounded"
                onClick={() =>
                  setActiveDropdown(activeDropdown === index ? null : index)
                }
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {activeDropdown === index && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowModal(true)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    View Patient Profile
                  </button>

                  {appointment.status !== "Checked In" &&
                    appointment.status !== "Completed" && (
                      <>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            // Call patient logic here
                          }}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Call Patient
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleSendReminder(appointment)}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Send Reminder
                        </button>
                        <hr className="my-1" />
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() =>
                            handleStatusUpdate(appointment._id, "Checked In")
                          }
                        >
                          Check In
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={() =>
                            handleStatusUpdate(appointment._id, "Cancelled")
                          }
                        >
                          Cancel Appointment
                        </button>
                      </>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
        View all today's appointments
      </button>
    </div>
  )
}

export default UpcomingAppointments
