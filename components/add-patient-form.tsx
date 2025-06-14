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

export type Patient = {
  id: number
  name: string
  email: string
  phone: string
  dateOfBirth: Date
  gender: string
  address: string
  medicalHistory: string
  lastVisit: string
  nextAppointment: string | null
  status: "Active" | "Completed"
  treatments: {
    date: string
    procedure: string
    notes: string
    dentist: string
  }[]
  avatar: string
}

interface AddPatientFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPatient: (patient: Omit<Patient, "id" | "lastVisit" | "treatments" | "avatar">) => void
}

export function AddPatientForm({ open, onOpenChange, onAddPatient }: AddPatientFormProps) {
  const [dateOfBirth, setDateOfBirth] = useState<Date>()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    medicalHistory: "",
    nextAppointment: null as string | null,
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!dateOfBirth) return

    onAddPatient({
      ...formData,
      dateOfBirth,
      status: "Active",
    })

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      gender: "",
      address: "",
      medicalHistory: "",
      nextAppointment: null,
    })
    setDateOfBirth(undefined)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>Enter the patient's information to create a new record.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !dateOfBirth && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfBirth ? format(dateOfBirth, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateOfBirth} onSelect={setDateOfBirth} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextAppointment">Next Appointment (Optional)</Label>
                <Input
                  id="nextAppointment"
                  type="datetime-local"
                  value={formData.nextAppointment || ""}
                  onChange={(e) => handleChange("nextAppointment", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                value={formData.medicalHistory}
                onChange={(e) => handleChange("medicalHistory", e.target.value)}
                placeholder="Allergies, conditions, medications, etc."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Patient</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
