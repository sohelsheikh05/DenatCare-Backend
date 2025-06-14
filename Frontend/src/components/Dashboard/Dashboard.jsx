"use client"

import { useState, useEffect } from "react"
import { CalendarDays, Clock, FileText, Users } from "lucide-react"
import axios from "axios"
import Header from "../Layout/Header.jsx"
import UpcomingAppointments from "./UpcomingAppointments.jsx"


const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    activePatients: 0,
    averageWaitTime: "14 min",
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch patients count
      const patientsResponse = await axios.get(import.meta.env.VITE_BACKEND_URL + "/patients")
      const patients = patientsResponse.data

      // Fetch today's appointments
      const appointmentsResponse = await axios.get(import.meta.env.VITE_BACKEND_URL + "/appointments/today")
      const todayAppointments = appointmentsResponse.data

      setStats({
        totalPatients: patients.length,
        todayAppointments: todayAppointments.length,
        activePatients: patients.filter((p) => p.status === "Active").length,
        averageWaitTime: "14 min",
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <Header />
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Total Patients</h3>
              <Users className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs text-gray-500">+12 from last month</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Today's Appointments</h3>
              <CalendarDays className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.todayAppointments}</div>
              <p className="text-xs text-gray-500">2 remaining</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Active Patients</h3>
              <FileText className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.activePatients}</div>
              <p className="text-xs text-gray-500">5 completing this week</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Average Wait Time</h3>
              <Clock className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.averageWaitTime}</div>
              <p className="text-xs text-gray-500">-2 min from last week</p>
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Today's Appointments</h3>
            <p className="text-sm text-gray-600">
              You have {stats.todayAppointments} appointments scheduled for today.
            </p>
          </div>
          <div className="p-6">
            <UpcomingAppointments />
          </div>
        </div>

    
       
      </main>
    </div>
  )
}

export default Dashboard
