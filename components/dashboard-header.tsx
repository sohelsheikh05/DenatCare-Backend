"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, LayoutDashboard, Menu, SmileIcon as Tooth, Users, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 font-bold">
          <Tooth className="h-6 w-6 text-emerald-500" />
          <span className="hidden md:inline-block">DentiTrack</span>
        </div>
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary flex items-center">
            <LayoutDashboard className="h-4 w-4 mr-1" />
            Dashboard
          </Link>
          <Link
            href="/patients"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center"
          >
            <Users className="h-4 w-4 mr-1" />
            Patients
          </Link>
          <Link
            href="/appointments"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Appointments
          </Link>
        </nav>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex items-center gap-2 font-bold mb-8">
              <Tooth className="h-6 w-6 text-emerald-500" />
              <span>DentiTrack</span>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/patients"
                className="flex items-center gap-2 text-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="h-5 w-5" />
                Patients
              </Link>
              <Link
                href="/appointments"
                className="flex items-center gap-2 text-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Calendar className="h-5 w-5" />
                Appointments
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="ml-auto flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <div className="h-6 w-6 rounded-full bg-emerald-500 grid place-items-center text-white font-medium">
                  DJ
                </div>
                <span className="hidden md:inline-block">Dr. Johnson</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
