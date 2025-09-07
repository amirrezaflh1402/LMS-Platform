"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Course } from "@/lib/mock-data"

interface ProgressChartProps {
  courses: Course[]
  completedLessons: string[]
}

export function ProgressChart({ courses, completedLessons }: ProgressChartProps) {
  const getCourseProgress = (course: Course) => {
    const courseLessons = course.lessons.length
    const courseCompletedLessons = completedLessons.filter((lessonId) =>
      course.lessons.some((lesson) => lesson.id === lessonId),
    ).length
    return courseLessons > 0 ? (courseCompletedLessons / courseLessons) * 100 : 0
  }

  const totalLessons = courses.reduce((acc, course) => acc + course.lessons.length, 0)
  const overallProgress = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>Your learning progress across all courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Total Progress</span>
            <Badge variant={overallProgress === 100 ? "default" : "secondary"}>{Math.round(overallProgress)}%</Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-4">
            <div
              className="bg-primary h-4 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {completedLessons.length} of {totalLessons} lessons completed
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {courses.map((course) => {
          const progress = getCourseProgress(course)
          const courseLessons = course.lessons.length
          const courseCompletedLessons = completedLessons.filter((lessonId) =>
            course.lessons.some((lesson) => lesson.id === lessonId),
          ).length

          return (
            <Card key={course.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{course.title}</h3>
                  <Badge variant={progress === 100 ? "default" : "secondary"}>{Math.round(progress)}%</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-1">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {courseCompletedLessons} of {courseLessons} lessons completed
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
