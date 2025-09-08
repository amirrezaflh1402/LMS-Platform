"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, BookOpen, Settings, LogOut } from "lucide-react"
import type { User as UserType } from "@/lib/mock-data"

export function UserDropdown() {
  const [user, setUser] = useState<UserType | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>
        <Link href="/signup">
          <Button>Sign Up</Button>
        </Link>
      </div>
    )
  }

  // const initials = user.name
  //   .split(" ")
  //   .map((n) => n[0])
  //   .join("")
  //   .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          {/* <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
          </Avatar> */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/courses" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            <span>My Courses</span>
          </Link>
        </DropdownMenuItem>
        {user.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Admin Panel</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
