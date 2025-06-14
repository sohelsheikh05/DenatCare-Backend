"use client"

import { useState } from "react"
import { Check, Plus, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type TodoItem = {
  id: number
  task: string
  priority: "High" | "Medium" | "Low"
  completed: boolean
}

export default function DoctorTodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, task: "Review Emma Thompson's X-rays before appointment", priority: "High", completed: false },
    { id: 2, task: "Call lab about James Wilson's crown", priority: "Medium", completed: false },
    { id: 3, task: "Sign off on treatment plan for Michael Chen", priority: "High", completed: true },
    { id: 4, task: "Update medical records for Sophia Rodriguez", priority: "Medium", completed: false },
    { id: 5, task: "Order new supplies for next week", priority: "Low", completed: false },
    { id: 6, task: "Review monthly patient statistics", priority: "Medium", completed: true },
  ])
  const [newTask, setNewTask] = useState("")
  const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("Medium")

  const toggleComplete = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const addTask = () => {
    if (newTask.trim() === "") return

    const newId = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1

    setTodos([...todos, { id: newId, task: newTask, priority: newPriority, completed: false }])
    setNewTask("")
    setNewPriority("Medium")
  }

  const deleteTask = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>To-Do List</CardTitle>
        <CardDescription>Tasks and reminders for today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todos.map((item) => (
            <div key={item.id} className="flex items-center space-x-2 group">
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 rounded-full p-0 ${
                  item.completed ? "bg-emerald-100 text-emerald-600" : "bg-muted"
                }`}
                onClick={() => toggleComplete(item.id)}
              >
                {item.completed && <Check className="h-3 w-3" />}
              </Button>
              <div className="flex-1">
                <p className={`font-medium ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                  {item.task}
                </p>
              </div>
              <Badge
                variant={
                  item.priority === "High" ? "destructive" : item.priority === "Medium" ? "outline" : "secondary"
                }
              >
                {item.priority}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deleteTask(item.id)}
              >
                <Trash2 className="h-3 w-3" />
                <span className="sr-only">Delete task</span>
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center space-x-2">
          <Input
            placeholder="Add new task..."
            className="flex-1"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <Select value={newPriority} onValueChange={(value) => setNewPriority(value as "High" | "Medium" | "Low")}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addTask}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
