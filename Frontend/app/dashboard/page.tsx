"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseCard } from "@/components/course-card"
import { ProgressTracker } from "@/components/progress-tracker"
import { mockCourses, type User, type Course } from "@/lib/mock-data"
import { BookOpen, Clock, Trophy, TrendingUp } from "lucide-react"
import { UserDropdown } from "@/components/user-dropdown"
import { Breadcrumb } from "@/components/breadcrumb"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setCompletedLessons(parsedUser.completedLessons || [])

    // Get enrolled courses
    const userEnrolledCourses = mockCourses.filter((course) => parsedUser.enrolledCourses?.includes(course.id))
    setEnrolledCourses(userEnrolledCourses)
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
  const totalLessons = enrolledCourses.reduce((acc, course) => acc + course.lessons.length, 0)
  const completedLessonsCount = completedLessons.length
  const overallProgress = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0

  const getCourseProgress = (course: Course) => {
    const courseLessons = course.lessons.length
    const courseCompletedLessons = completedLessons.filter((lessonId) =>
      course.lessons.some((lesson) => lesson.id === lessonId),
    ).length
    return courseLessons > 0 ? (courseCompletedLessons / courseLessons) * 100 : 0
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="h-3 w-3 md:h-5 md:w-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg md:text-xl font-bold text-foreground">LearnHub</h1>
            </Link>
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link href="/courses" className="hidden sm:block">
                <Button variant="outline" size="sm" className="text-xs md:text-sm bg-transparent">
                  Browse Courses
                </Button>
              </Link>
              {user.role === "admin" && (
                <Link href="/admin" className="hidden md:block">
                  <Button variant="outline" size="sm" className="text-xs md:text-sm bg-transparent">
                    Admin Panel
                  </Button>
                </Link>
              )}
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
            <h1 className="text-xl md:text-3xl font-bold text-foreground">Welcome back, {user.name}!</h1>
            <p className="text-sm md:text-base text-muted-foreground">Continue your learning journey</p>
            {user.role === "admin" && <Badge className="mt-1 text-xs">Admin</Badge>}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">{enrolledCourses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Completed Lessons</CardTitle>
              <Trophy className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">{completedLessonsCount}</div>
              <p className="text-xs text-muted-foreground">out of {totalLessons} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Overall Progress</CardTitle>
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">{Math.round(overallProgress)}%</div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Learning Time</CardTitle>
              <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">24h</div>
              <p className="text-xs text-muted-foreground">this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses" className="text-xs md:text-sm">
              My Courses
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-xs md:text-sm">
              Progress
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-xs md:text-sm">
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            {enrolledCourses.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg md:text-2xl font-semibold">Continue Learning</h2>
                  <Link href="/courses">
                    <Button variant="outline" size="sm" className="text-xs md:text-sm bg-transparent">
                      Browse More Courses
                    </Button>
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {enrolledCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      showEnrollButton={false}
                      progress={getCourseProgress(course)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <Card className="text-center py-8 md:py-12">
                <CardContent>
                  <BookOpen className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground mx-auto mb-4" />
                  <CardTitle className="mb-2 text-base md:text-lg">No courses enrolled yet</CardTitle>
                  <CardDescription className="mb-4 text-sm md:text-base">
                    Start your learning journey by enrolling in your first course
                  </CardDescription>
                  <Link href="/courses">
                    <Button size="sm" className="text-xs md:text-sm">
                      Browse Courses
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <h2 className="text-lg md:text-2xl font-semibold">Learning Progress</h2>
            <ProgressTracker
              user={user}
              enrolledCourses={enrolledCourses}
              completedLessons={completedLessons}
              onUpdateProgress={(lessonId, timeSpent) => {
                // Mock progress update handler
                console.log(`Updated progress for lesson ${lessonId}: ${timeSpent} minutes`)
              }}
            />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-lg md:text-2xl font-semibold">Profile Settings</h2>
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Personal Information</CardTitle>
                <CardDescription className="text-sm md:text-base">Manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs md:text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-sm md:text-base text-foreground">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm md:text-base text-foreground">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-medium text-muted-foreground">Role</label>
                    <p className="text-sm md:text-base text-foreground capitalize">{user.role}</p>
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-medium text-muted-foreground">Member Since</label>
                    <p className="text-sm md:text-base text-foreground">January 2024</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="outline" size="sm" className="text-xs md:text-sm bg-transparent">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
