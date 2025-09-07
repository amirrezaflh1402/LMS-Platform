"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminCourseManager } from "@/components/admin-course-manager"
import { AdminUserManager } from "@/components/admin-user-manager"
import { mockCourses, mockUsers, type User } from "@/lib/mock-data"
import { BookOpen, Users, TrendingUp, DollarSign, ArrowLeft } from "lucide-react"
import { UserDropdown } from "@/components/user-dropdown"
import { Breadcrumb } from "@/components/breadcrumb"

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "admin") {
      router.push("/dashboard")
      return
    }

    setUser(parsedUser)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  // Calculate statistics
  const totalCourses = mockCourses.length
  const totalUsers = mockUsers.length
  const totalStudents = mockUsers.filter((u) => u.role === "student").length
  const totalRevenue = mockCourses.reduce((acc, course) => acc + course.price * course.enrolledStudents, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-primary flex items-center justify-center">
                  <BookOpen className="h-3 w-3 md:h-5 md:w-5 text-primary-foreground" />
                </div>
                <h1 className="text-lg md:text-xl font-bold text-foreground">LearnHub Admin</h1>
              </Link>
              <Badge variant="secondary" className="text-xs">
                Admin Panel
              </Badge>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link href="/dashboard" className="hidden sm:block">
                <Button variant="outline" size="sm" className="text-xs md:text-sm bg-transparent">
                  <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  <span className="hidden md:inline">Back to Dashboard</span>
                  <span className="md:hidden">Back</span>
                </Button>
              </Link>
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      <Breadcrumb />

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Welcome Section */}
        <div className="flex items-center space-x-4 mb-6 md:mb-8">
          <Avatar className="h-12 w-12 md:h-16 md:w-16">
            <AvatarFallback className="text-sm md:text-lg font-semibold bg-primary text-primary-foreground">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm md:text-base text-muted-foreground">Manage courses, users, and platform analytics</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground">Active courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Total Users</CardTitle>
              <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {totalStudents} students, {totalUsers - totalStudents} admins
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From course enrollments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Avg. Enrollment</CardTitle>
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">
                {Math.round(mockCourses.reduce((acc, course) => acc + course.enrolledStudents, 0) / totalCourses)}
              </div>
              <p className="text-xs text-muted-foreground">Students per course</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses" className="text-xs md:text-sm">
              Course Management
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs md:text-sm">
              User Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs md:text-sm">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <AdminCourseManager />
          </TabsContent>

          <TabsContent value="users">
            <AdminUserManager />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-semibold">Platform Analytics</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Performance</CardTitle>
                  <CardDescription>Most popular courses by enrollment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCourses
                      .sort((a, b) => b.enrolledStudents - a.enrolledStudents)
                      .slice(0, 5)
                      .map((course, index) => (
                        <div key={course.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                            <span className="text-sm">{course.title}</span>
                          </div>
                          <Badge variant="secondary">{course.enrolledStudents} students</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Course</CardTitle>
                  <CardDescription>Top earning courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCourses
                      .sort((a, b) => b.price * b.enrolledStudents - a.price * a.enrolledStudents)
                      .slice(0, 5)
                      .map((course, index) => (
                        <div key={course.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                            <span className="text-sm">{course.title}</span>
                          </div>
                          <Badge variant="secondary">
                            ${(course.price * course.enrolledStudents).toLocaleString()}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
