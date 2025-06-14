"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import type { Patient } from "./add-patient-form"

interface TreatmentRecordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: Patient | null
  onAddTreatment: (
    patientId: number,
    treatment: { date: string; procedure: string; notes: string; dentist: string },
  ) => void
}

export function TreatmentRecordDialog({ open, onOpenChange, patient, onAddTreatment }: TreatmentRecordDialogProps) {
  const [newTreatment, setNewTreatment] = useState({
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    procedure: "",
    notes: "",
    dentist: "Dr. Johnson",
  })

  const handleChange = (field: string, value: string) => {
    setNewTreatment((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!patient) return

    onAddTreatment(patient.id, newTreatment)

    // Reset form
    setNewTreatment({
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      procedure: "",
      notes: "",
      dentist: "Dr. Johnson",
    })
  }

  if (!patient) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Treatment Record: {patient.name}</DialogTitle>
          <DialogDescription>View past treatments and add new treatment records.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          <h3 className="font-medium">Treatment History</h3>
          {patient.treatments.length > 0 ? (
            patient.treatments.map((treatment, index) => (
              <div key={index} className="border rounded-md p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{treatment.procedure}</h4>
                  <span className="text-sm text-muted-foreground">
                    {new Date(treatment.date).toLocaleDateString()} at{" "}
                    {new Date(treatment.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-sm">{treatment.notes}</p>
                <p className="text-sm text-muted-foreground">Dentist: {treatment.dentist}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No treatment records found.</p>
          )}
        </div>
        <Separator />
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <h3 className="font-medium">Add New Treatment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date & Time</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={newTreatment.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dentist">Dentist</Label>
                <Input
                  id="dentist"
                  value={newTreatment.dentist}
                  onChange={(e) => handleChange("dentist", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="procedure">Procedure</Label>
              <Input
                id="procedure"
                value={newTreatment.procedure}
                onChange={(e) => handleChange("procedure", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newTreatment.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Treatment details, observations, follow-up requirements, etc."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button type="submit">Add Treatment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
