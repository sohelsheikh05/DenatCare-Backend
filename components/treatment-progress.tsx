"use client"

import { CheckCircle2, Clock } from "lucide-react"

import { Progress } from "@/components/ui/progress"

export default function TreatmentProgress() {
  const treatments = [
    {
      id: 1,
      patient: "Emma Thompson",
      treatment: "Root Canal Treatment",
      progress: 66,
      sessions: "2/3 completed",
      nextSession: "Today, 10:00 AM",
    },
    {
      id: 2,
      patient: "Michael Chen",
      treatment: "Invisalign",
      progress: 25,
      sessions: "3/12 completed",
      nextSession: "Jun 20, 11:30 AM",
    },
    {
      id: 3,
      patient: "Sophia Rodriguez",
      treatment: "Dental Implant",
      progress: 80,
      sessions: "4/5 completed",
      nextSession: "Today, 1:15 PM",
    },
    {
      id: 4,
      patient: "James Wilson",
      treatment: "Crown Procedure",
      progress: 50,
      sessions: "1/2 completed",
      nextSession: "Tomorrow, 2:00 PM",
    },
    {
      id: 5,
      patient: "David Brown",
      treatment: "Braces",
      progress: 40,
      sessions: "4/10 completed",
      nextSession: "Tomorrow, 9:00 AM",
    },
  ]

  return (
    <div className="space-y-4">
      {treatments.map((treatment) => (
        <div key={treatment.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{treatment.patient}</p>
              <p className="text-sm text-muted-foreground">{treatment.treatment}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{treatment.sessions}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {treatment.nextSession}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={treatment.progress} className="h-2" />
            <span className="text-xs font-medium">{treatment.progress}%</span>
          </div>
        </div>
      ))}
      <div className="pt-2 flex items-center justify-between text-sm">
        <div className="flex items-center text-muted-foreground">
          <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />5 treatments completed this week
        </div>
        <button className="font-medium text-primary">View all treatments</button>
      </div>
    </div>
  )
}
