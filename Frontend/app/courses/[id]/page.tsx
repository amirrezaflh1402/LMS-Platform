"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { mockCourses, mockQuizzes, type Course, type User } from "@/lib/mock-data"
import { Clock, Users, Star, Play, CheckCircle, BookOpen } from "lucide-react"
import { LessonPlayer } from "@/components/lesson-player"
import { QuizComponent } from "@/components/quiz-component"
import { UserDropdown } from "@/components/user-dropdown"
import { Breadcrumb } from "@/components/breadcrumb"

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [showQuiz, setShowQuiz] = useState<string | null>(null)

  useEffect(() => {
    // Get course data
    const foundCourse = mockCourses.find((c) => c.id === params.id)
    setCourse(foundCourse || null)

    // Get user data from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setIsEnrolled(parsedUser.enrolledCourses?.includes(params.id) || false)
      setCompletedLessons(parsedUser.completedLessons || [])
    }
  }, [params.id])

  const handleEnroll = () => {
    if (!user) {
      router.push("/login")
      return
    }

    // Mock enrollment
    const updatedUser = {
      ...user,
      enrolledCourses: [...(user.enrolledCourses || []), params.id as string],
    }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
    setIsEnrolled(true)
  }

  const handleLessonComplete = (lessonId: string) => {
    if (!user) return

    const updatedCompletedLessons = [...completedLessons, lessonId]
    const updatedUser = {
      ...user,
      completedLessons: updatedCompletedLessons,
    }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
    setCompletedLessons(updatedCompletedLessons)

    if (lessonId.includes("final")) {
      const quiz = mockQuizzes.find((q) => q.lessonId === lessonId)
      if (quiz) {
        setShowQuiz(lessonId)
      }
    }
  }

  const handleQuizComplete = (lessonId: string, score: number, totalQuestions: number) => {
    console.log(`Quiz completed for lesson ${lessonId}: ${score}/${totalQuestions}`)
    setShowQuiz(null)
    setSelectedLesson(null)
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Course not found</p>
      </div>
    )
  }

  const progress =
    course.lessons.length > 0
      ? (completedLessons.filter((id) => course.lessons.some((lesson) => lesson.id === id)).length /
          course.lessons.length) *
        100
      : 0

  const currentQuiz = showQuiz ? mockQuizzes.find((q) => q.lessonId === showQuiz) : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">LearnHub</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/courses">
                <Button variant="outline">All Courses</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Info */}
          <div className="lg:col-span-2">
            {selectedLesson && !showQuiz && !selectedLesson.includes("final") && (
              <div className="mb-6">
                <LessonPlayer
                  lesson={course.lessons.find((l) => l.id === selectedLesson)!}
                  isCompleted={completedLessons.includes(selectedLesson)}
                  onComplete={(lessonId, timeSpent) => {
                    handleLessonComplete(lessonId)
                    console.log(`Lesson ${lessonId} completed in ${timeSpent} minutes`)
                  }}
                  onProgress={(lessonId, progress) => {
                    console.log(`Lesson ${lessonId} progress: ${progress}%`)
                  }}
                />
              </div>
            )}

            {currentQuiz && showQuiz && (
              <div className="mb-6">
                <QuizComponent
                  quiz={currentQuiz}
                  onComplete={(score, totalQuestions) => handleQuizComplete(showQuiz, score, totalQuestions)}
                />
              </div>
            )}

            {/* Course thumbnail when no lesson selected */}
            {!selectedLesson && !showQuiz && (
              <div className="aspect-video bg-muted rounded-lg mb-6 relative overflow-hidden">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Button size="lg" className="rounded-full h-16 w-16 p-0">
                    <Play className="h-6 w-6 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="secondary">{course.level}</Badge>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8 (234 reviews)</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{course.title}</h1>
                <p className="text-muted-foreground mb-4">{course.description}</p>
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolledStudents} students</span>
                  </div>
                  <span>by {course.instructor}</span>
                </div>
              </div>

              {isEnrolled && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Course Progress</span>
                    <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Course Content */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Course Content</h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {course.lessons.map((lesson, index) => {
                    const isCompleted = completedLessons.includes(lesson.id)
                    const isAccessible = isEnrolled
                    const isFinalQuiz = lesson.id.includes("final")
                    const hasQuiz = mockQuizzes.some((q) => q.lessonId === lesson.id)

                    return (
                      <AccordionItem key={lesson.id} value={lesson.id} className="border rounded-lg">
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <div className="flex items-center space-x-3 w-full">
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                                isCompleted
                                  ? "bg-green-100 text-green-700"
                                  : isAccessible
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                            </div>
                            <div className="flex-1 text-left">
                              <h3 className={`font-medium ${isCompleted ? "text-green-700" : ""}`}>{lesson.title}</h3>
                              <p className="text-sm text-muted-foreground">{lesson.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {isFinalQuiz ? (
                                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                                  Final Quiz
                                </Badge>
                              ) : (
                                <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                              )}
                              {!isAccessible && <Badge variant="outline">Locked</Badge>}
                            </div>
                          </div>
                        </AccordionTrigger>
                        {isAccessible && (
                          <AccordionContent className="px-4 pb-4">
                            <div className="space-y-3">
                              <p className="text-sm text-muted-foreground">{lesson.description}</p>
                              <Button
                                onClick={() => {
                                  if (isFinalQuiz) {
                                    setShowQuiz(lesson.id)
                                  } else {
                                    setSelectedLesson(lesson.id)
                                  }
                                }}
                                variant={selectedLesson === lesson.id || showQuiz === lesson.id ? "default" : "outline"}
                                size="sm"
                              >
                                {isFinalQuiz ? (
                                  <>
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    {showQuiz === lesson.id ? "Taking Quiz" : "Take Final Quiz"}
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 mr-2" />
                                    {selectedLesson === lesson.id ? "Currently Playing" : "Play Lesson"}
                                  </>
                                )}
                              </Button>
                              {isCompleted && isFinalQuiz && (
                                <Button
                                  onClick={() => setShowQuiz(lesson.id)}
                                  variant="outline"
                                  size="sm"
                                  className="ml-2"
                                >
                                  Retake Quiz
                                </Button>
                              )}
                            </div>
                          </AccordionContent>
                        )}
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">${course.price}</CardTitle>
                <CardDescription>One-time payment, lifetime access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEnrolled ? (
                  <Button className="w-full" size="lg" onClick={handleEnroll}>
                    Enroll Now
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Badge variant="secondary" className="w-full justify-center py-2">
                      ✓ Enrolled
                    </Badge>
                    <Button className="w-full bg-transparent" variant="outline" asChild>
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                  </div>
                )}

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Lessons</span>
                    <span>{course.lessons.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Level</span>
                    <span>{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Students</span>
                    <span>{course.enrolledStudents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Quizzes</span>
                    <span>{mockQuizzes.filter((q) => course.lessons.some((l) => l.id === q.lessonId)).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
