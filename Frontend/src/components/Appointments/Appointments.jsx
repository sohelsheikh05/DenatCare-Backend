"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, PlusCircle, Settings } from "lucide-react"
import { addDays, format } from "date-fns"
import axios from "axios"
import toast from "react-hot-toast"
import Header from "../Layout/Header.jsx"

const Appointments = () => {
  const [date, setDate] = useState(new Date())
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [date])

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/appointments", {
        params: { date: format(date, "yyyy-MM-dd") },
      })
      setAppointments(response.data)
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast.error("Failed to fetch appointments")
    } finally {
      setLoading(false)
    }
  }

  const handlePrevDay = () => {
    setDate(addDays(date, -1))
  }

  const handleNextDay = () => {
    setDate(addDays(date, 1))
  }

  const getTypeColor = (type) => {
    const colors = {
      Checkup: "bg-blue-100 text-blue-700 border-blue-200",
      "Root Canal": "bg-purple-100 text-purple-700 border-purple-200",
      Cleaning: "bg-green-100 text-green-700 border-green-200",
      "Dental Cleaning": "bg-green-100 text-green-700 border-green-200",
      Consultation: "bg-orange-100 text-orange-700 border-orange-200",
      Filling: "bg-cyan-100 text-cyan-700 border-cyan-200",
      "Cavity Filling": "bg-cyan-100 text-cyan-700 border-cyan-200",
    }
    return colors[type] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <Header />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
              <p className="text-gray-600 mt-1">Manage your appointments </p>
            </div>
           
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center gap-2 text-emerald-600 mb-4">
                <CalendarIcon className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Calendar</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Select a date to view or manage appointments</p>

              {/* Simple date picker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <button onClick={handlePrevDay} className="p-1 hover:bg-gray-100 rounded">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="font-medium">{format(date, "MMMM yyyy")}</span>
                  <button onClick={handleNextDay} className="p-1 hover:bg-gray-100 rounded">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{format(date, "d")}</div>
                  <div className="text-sm text-gray-600">{format(date, "EEEE")}</div>
                </div>
              </div>
            </div>

            {/* Working Hours Card */}
            <div className="bg-white rounded-lg border p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Working Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">9:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium text-red-600">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <button onClick={handlePrevDay} className="p-1 hover:bg-gray-100 rounded">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <h2 className="text-2xl font-bold text-gray-900">{format(date, "EEEE, MMMM d, yyyy")}</h2>
                      <button onClick={handleNextDay} className="p-1 hover:bg-gray-100 rounded">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="flex items-center gap-1">
                        <div className="h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-emerald-600"></div>
                        </div>
                        <span className="text-sm">{appointments.length} appointments scheduled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointments</h3>
                </div>

                {loading ? (
                  <div className="text-center py-8">Loading appointments...</div>
                ) : (
                  <div className="space-y-3">
                    {appointments.length > 0 ? (
                      appointments.map((appointment) => (
                        <div
                          key={appointment._id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-full">
                                <Clock className="h-5 w-5 text-emerald-600" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{appointment.time}</div>
                                <div className="text-gray-600">{appointment.patientName}</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 font-medium rounded-full border ${getTypeColor(appointment.type)}`}
                            >
                              {appointment.type}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                appointment.status === "Scheduled"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : appointment.status === "Checked In"
                                    ? "bg-green-100 text-green-800"
                                    : appointment.status === "Completed"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-red-100 text-red-800"
                              }`}
                            >
                              {appointment.status}
                            </span>
                            
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CalendarIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</h3>
                       
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Appointments
