"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockCourses } from "@/lib/mock-data"
import { Clock, Users, Star, BookOpen } from "lucide-react"
import { UserDropdown } from "@/components/user-dropdown"
import { Breadcrumb } from "@/components/breadcrumb"

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || course.level === levelFilter
    return matchesSearch && matchesLevel
  })

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
              <Link href="/dashboard" className="hidden sm:block">
                <Button variant="outline" size="sm" className="text-xs md:text-sm bg-transparent">
                  Dashboard
                </Button>
              </Link>
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      <Breadcrumb />

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">All Courses</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Discover and enroll in courses that match your interests
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 md:mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md text-sm md:text-base"
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full sm:w-48 text-sm md:text-base">
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Course Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted relative">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2 text-xs" variant="secondary">
                  {course.level}
                </Badge>
              </div>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg leading-tight">{course.title}</CardTitle>
                <CardDescription className="text-xs md:text-sm line-clamp-2">{course.description}</CardDescription>
                <div className="flex items-center text-xs md:text-sm text-muted-foreground mt-2">
                  <span>by {course.instructor}</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 md:h-4 md:w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 md:h-4 md:w-4" />
                      <span>{course.enrolledStudents}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg md:text-2xl font-bold text-primary">${course.price}</span>
                  <Link href={`/courses/${course.id}`}>
                    <Button size="sm" className="text-xs md:text-sm">
                      View Course
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm md:text-base text-muted-foreground">No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
