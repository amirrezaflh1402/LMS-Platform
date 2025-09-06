import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users, Star } from "lucide-react"
import type { Course } from "@/lib/mock-data"

interface CourseCardProps {
  course: Course
  showEnrollButton?: boolean
  progress?: number
}

export function CourseCard({ course, showEnrollButton = true, progress }: CourseCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-muted relative">
        <img src={course.thumbnail || "/placeholder.svg"} alt={course.title} className="w-full h-full object-cover" />
        <Badge className="absolute top-2 right-2" variant="secondary">
          {course.level}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{course.title}</CardTitle>
        <CardDescription className="text-sm line-clamp-2">{course.description}</CardDescription>
        <div className="flex items-center text-sm text-muted-foreground mt-2">
          <span>by {course.instructor}</span>
        </div>
      </CardHeader>
      <CardContent>
        {progress !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{course.enrolledStudents}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>4.8</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {showEnrollButton ? (
            <>
              <span className="text-2xl font-bold text-primary">${course.price}</span>
              <Link href={`/courses/${course.id}`}>
                <Button>View Course</Button>
              </Link>
            </>
          ) : (
            <Link href={`/courses/${course.id}`} className="w-full">
              <Button className="w-full bg-transparent" variant="outline">
                Continue Learning
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
