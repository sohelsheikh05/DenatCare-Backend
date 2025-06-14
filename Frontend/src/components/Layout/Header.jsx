"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Calendar, LayoutDashboard, Menu, Users, X } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Patients", href: "/patients", icon: Users },
    { name: "Appointments", href: "/appointments", icon: Calendar },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center gap-2 font-bold">
          <div className="h-6 w-6 bg-emerald-500 rounded flex items-center justify-center">
            <span className="text-white text-sm">🦷</span>
          </div>
          <span className="hidden md:inline-block">DentiTrack</span>
        </div>

        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-emerald-600 flex items-center ${
                  isActive(item.href) ? "text-emerald-600" : "text-gray-600"
                }`}
              >
                <Icon className="h-4 w-4 mr-1" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden ml-auto mr-4" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* User menu */}
        <div className="ml-auto hidden md:flex items-center space-x-2 relative">
          <button
            className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-white font-medium text-xs">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <span className="hidden md:inline-block">{user?.name}</span>
          </button>
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border">
              <button
                onClick={() => {
                  logout()
                  setIsUserMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b md:hidden">
            <nav className="flex flex-col space-y-4 p-4">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 text-lg font-medium ${
                      isActive(item.href) ? "text-emerald-600" : "text-gray-600"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
              <button
                onClick={() => {
                  logout()
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center gap-2 text-lg font-medium text-red-600 mt-4 pt-4 border-t"
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
