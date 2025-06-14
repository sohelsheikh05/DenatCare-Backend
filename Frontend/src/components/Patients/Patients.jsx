"use client"

import { useState, useEffect } from "react"
import { Calendar, CheckCircle, FileText, PlusCircle, Search } from "lucide-react"
import { format } from "date-fns"
import axios from "axios"
import toast from "react-hot-toast"
import Header from "../Layout/Header.jsx"
import AddPatientModal from "./AddPatientModal.jsx"
import TreatmentRecordModal from "./TreatmentRecordModal.jsx"
import ScheduleAppointmentModal from "./ScheduleAppointmentModal.jsx"

const Patients = () => {
  const [patients, setPatients] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const [loading, setLoading] = useState(true)
  const [addPatientOpen, setAddPatientOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [treatmentRecordOpen, setTreatmentRecordOpen] = useState(false)
  const [scheduleAppointmentOpen, setScheduleAppointmentOpen] = useState(false)

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/patients", {
        params: { search: searchTerm },
      })
      setPatients(response.data)
    } catch (error) {
      console.error("Error fetching patients:", error)
      toast.error("Failed to fetch patients")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (!loading) fetchPatients()
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchTerm])

  const activePatients = patients.filter((p) => p.status === "Active")
  const completedPatients = patients.filter((p) => p.status === "Completed")

  const handleAddPatient = async (patientData) => {
    try {
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/patients", patientData)
      setPatients([response.data, ...patients])
      toast.success("Patient added successfully")
    } catch (error) {
      console.error("Error adding patient:", error)
      toast.error("Failed to add patient")
    }
  }

  const handleMarkAsCompleted = async (patientId) => {
    try {
      await axios.patch(import.meta.env.VITE_BACKEND_URL + `/patients/${patientId}/complete`)
      fetchPatients()
      toast.success("Patient marked as completed")
    } catch (error) {
      console.error("Error updating patient:", error)
      toast.error("Failed to update patient")
    }
  }

  const handleAddTreatment = async (patientId, treatment) => {
    try {
      await axios.post(import.meta.env.VITE_BACKEND_URL + `/patients/${patientId}/treatments`, treatment)
      fetchPatients()
      toast.success("Treatment record added")
    } catch (error) {
      console.error("Error adding treatment:", error)
      toast.error("Failed to add treatment")
    }
  }

  const handleScheduleAppointment = async (patientId, appointmentData) => {
    try {
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/appointments", {
        patient: patientId,
        date: appointmentData.date,
        time: appointmentData.time,
        type: appointmentData.type,
        notes: appointmentData.notes,
      })
      fetchPatients()
      toast.success("Appointment scheduled successfully")
    } catch (error) {
      console.error("Error scheduling appointment:", error)
      toast.error("Failed to schedule appointment")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading patients...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <Header />
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Patients</h2>
          <button
            onClick={() => setAddPatientOpen(true)}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Patient
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search patients..."
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("active")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "active"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Active Patients ({activePatients.length})
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "completed"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Completed Patients ({completedPatients.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "active" && (
              <div className="space-y-4">
                {activePatients.length > 0 ? (
                  activePatients.map((patient) => (
                    <PatientCard
                      key={patient._id}
                      patient={patient}
                      onMarkCompleted={handleMarkAsCompleted}
                      onViewTreatments={(patient) => {
                        setSelectedPatient(patient)
                        setTreatmentRecordOpen(true)
                      }}
                      onScheduleAppointment={(patient) => {
                        setSelectedPatient(patient)
                        setScheduleAppointmentOpen(true)
                      }}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No active patients found</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "completed" && (
              <div className="space-y-4">
                {completedPatients.length > 0 ? (
                  completedPatients.map((patient) => (
                    <PatientCard
                      key={patient._id}
                      patient={patient}
                      isCompleted={true}
                      onViewTreatments={(patient) => {
                        setSelectedPatient(patient)
                        setTreatmentRecordOpen(true)
                      }}
                      onScheduleAppointment={(patient) => {
                        setSelectedPatient(patient)
                        setScheduleAppointmentOpen(true)
                      }}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No completed patients found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddPatientModal open={addPatientOpen} onClose={() => setAddPatientOpen(false)} onAddPatient={handleAddPatient} />
      <TreatmentRecordModal
        open={treatmentRecordOpen}
        onClose={() => setTreatmentRecordOpen(false)}
        patient={selectedPatient}
        onAddTreatment={handleAddTreatment}
      />
      <ScheduleAppointmentModal
        open={scheduleAppointmentOpen}
        onClose={() => setScheduleAppointmentOpen(false)}
        patient={selectedPatient}
        onScheduleAppointment={handleScheduleAppointment}
      />
    </div>
  )
}

const PatientCard = ({ patient, isCompleted, onMarkCompleted, onViewTreatments, onScheduleAppointment }) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
          <span className="text-emerald-600 font-medium">{patient.name?.charAt(0)?.toUpperCase()}</span>
        </div>
        <div>
          <h3 className="font-medium">{patient.name}</h3>
          <p className="text-sm text-gray-500">{patient.phone}</p>
          <p className="text-sm text-gray-500">{patient.email}</p>
        </div>
      </div>

      <div className="hidden md:block">
        <p className="text-sm font-medium">Last Visit</p>
        <p className="text-sm text-gray-500">{format(new Date(patient.lastVisit), "PPP")}</p>
      </div>

      <div className="hidden md:block">
        {patient.nextAppointment ? (
          <div>
            <p className="text-sm font-medium">Next Appointment</p>
            <p className="text-sm text-gray-500">{format(new Date(patient.nextAppointment), "PPP")}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No appointment scheduled</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onViewTreatments(patient)}
          className="flex items-center px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
        >
          <FileText className="mr-1 h-4 w-4" />
          Treatments
        </button>
        <button
          onClick={() => onScheduleAppointment(patient)}
          className="flex items-center px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
        >
          <Calendar className="mr-1 h-4 w-4" />
          Schedule
        </button>
        {!isCompleted && (
          <button
            onClick={() => onMarkCompleted(patient._id)}
            className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Complete
          </button>
        )}
      </div>
    </div>
  )
}

export default Patients
