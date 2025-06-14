"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Patient } from "./add-patient-form"

interface ScheduleAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: Patient | null
  onScheduleAppointment: (patientId: number, appointmentDate: string, appointmentType: string, notes: string) => void
}

export function ScheduleAppointmentDialog({
  open,
  onOpenChange,
  patient,
  onScheduleAppointment,
}: ScheduleAppointmentDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState("10:00")
  const [appointmentType, setAppointmentType] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!patient || !date) return

    const appointmentDate = `${format(date, "yyyy-MM-dd")}T${time}`
    onScheduleAppointment(patient.id, appointmentDate, appointmentType, notes)

    // Reset form
    setDate(new Date())
    setTime("10:00")
    setAppointmentType("")
    setNotes("")
    onOpenChange(false)
  }

  if (!patient) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Schedule Appointment: {patient.name}</DialogTitle>
            <DialogDescription>Schedule the next appointment for this patient.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Appointment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Appointment Time</Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointmentType">Appointment Type</Label>
              <Select value={appointmentType} onValueChange={setAppointmentType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dental Cleaning">Dental Cleaning</SelectItem>
                  <SelectItem value="Root Canal">Root Canal</SelectItem>
                  <SelectItem value="Cavity Filling">Cavity Filling</SelectItem>
                  <SelectItem value="Extraction">Extraction</SelectItem>
                  <SelectItem value="Crown Fitting">Crown Fitting</SelectItem>
                  <SelectItem value="Braces Adjustment">Braces Adjustment</SelectItem>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional information about the appointment"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Schedule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
