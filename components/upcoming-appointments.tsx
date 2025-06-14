"use client"
import { Clock, MoreHorizontal, Phone, Send, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export default function UpcomingAppointments() {
  const { toast } = useToast()

  const todayAppointments = [
    {
      id: 1,
      patient: "Emma Thompson",
      time: "10:00 AM - 11:00 AM",
      type: "Root Canal - Session 2",
      status: "Checked In",
      avatar: "/placeholder.svg?height=32&width=32",
      phone: "(555) 123-4567",
    },
    {
      id: 2,
      patient: "Michael Chen",
      time: "11:30 AM - 12:30 PM",
      type: "Dental Cleaning",
      status: "Scheduled",
      avatar: "/placeholder.svg?height=32&width=32",
      phone: "(555) 234-5678",
    },
    {
      id: 3,
      patient: "Sophia Rodriguez",
      time: "1:15 PM - 2:45 PM",
      type: "Wisdom Tooth Extraction",
      status: "Scheduled",
      avatar: "/placeholder.svg?height=32&width=32",
      phone: "(555) 345-6789",
    },
    {
      id: 4,
      patient: "James Wilson",
      time: "3:00 PM - 4:00 PM",
      type: "Dental Implant Consultation",
      status: "Scheduled",
      avatar: "/placeholder.svg?height=32&width=32",
      phone: "(555) 456-7890",
    },
  ]

  const handleSendReminder = (patient: string, phone: string, time: string) => {
    // Simulate sending reminder
    toast({
      title: "Reminder Sent",
      description: `Appointment reminder sent to ${patient} at ${phone}`,
    })
  }

  return (
    <div className="space-y-2">
      {todayAppointments.map((appointment) => (
        <div key={appointment.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={appointment.avatar || "/placeholder.svg"} alt={appointment.patient} />
              <AvatarFallback>
                {appointment.patient
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{appointment.patient}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {appointment.time}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <p className="font-medium">{appointment.type}</p>
            <p className="text-xs text-muted-foreground">Today</p>
          </div>
          <div className="flex items-center">
            <span
              className={`mr-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                appointment.status === "Checked In" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
              }`}
            >
              {appointment.status}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* View Patient Profile is always available */}
                <DropdownMenuItem className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  View Patient Profile
                </DropdownMenuItem>

                {/* Only show these options for patients who are not checked in */}
                {appointment.status !== "Checked In" && (
                  <>
                    <DropdownMenuItem className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Patient
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center"
                      onClick={() => handleSendReminder(appointment.patient, appointment.phone, appointment.time)}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send Reminder
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Cancel Appointment</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full">
        View all today's appointments
      </Button>
    </div>
  )
}
