"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Trophy, Target, TrendingUp, Award } from "lucide-react"
import type { Course, User } from "@/lib/mock-data"

interface ProgressTrackerProps {
  user: User
  enrolledCourses: Course[]
  completedLessons: string[]
  onUpdateProgress?: (lessonId: string, timeSpent: number) => void
}

interface LearningStreak {
  current: number
  longest: number
  lastActivity: string
}

interface LearningStats {
  totalTimeSpent: number
  averageSessionTime: number
  lessonsThisWeek: number
  streak: LearningStreak
}

export function ProgressTracker({ user, enrolledCourses, completedLessons, onUpdateProgress }: ProgressTrackerProps) {
  const [learningStats, setLearningStats] = useState<LearningStats>({
    totalTimeSpent: 1440, // Mock: 24 hours in minutes
    averageSessionTime: 45, // Mock: 45 minutes
    lessonsThisWeek: 8, // Mock: 8 lessons this week
    streak: {
      current: 5, // Mock: 5 day streak
      longest: 12, // Mock: longest streak 12 days
      lastActivity: new Date().toISOString().split("T")[0],
    },
  })

  const [weeklyGoal, setWeeklyGoal] = useState(10) // Mock: 10 lessons per week goal
  const [achievements, setAchievements] = useState([
    { id: 1, title: "First Course", description: "Enrolled in your first course", earned: true, date: "2024-01-15" },
    { id: 2, title: "Quick Learner", description: "Completed 5 lessons in one day", earned: true, date: "2024-01-20" },
    { id: 3, title: "Consistent", description: "Maintained a 7-day learning streak", earned: false, date: null },
    { id: 4, title: "Course Master", description: "Completed your first course", earned: false, date: null },
  ])

  const totalLessons = enrolledCourses.reduce((acc, course) => acc + course.lessons.length, 0)
  const overallProgress = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0
  const weeklyProgress = (learningStats.lessonsThisWeek / weeklyGoal) * 100

  const getCourseProgress = (course: Course) => {
    const courseLessons = course.lessons.length
    const courseCompletedLessons = completedLessons.filter((lessonId) =>
      course.lessons.some((lesson) => lesson.id === lessonId),
    ).length
    return courseLessons > 0 ? (courseCompletedLessons / courseLessons) * 100 : 0
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const earnedAchievements = achievements.filter((a) => a.earned)
  const nextAchievement = achievements.find((a) => !a.earned)

  return (
    <div className="space-y-6">
      {/* Learning Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Learning Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(learningStats.totalTimeSpent)}</div>
            <p className="text-xs text-muted-foreground">
              Avg. {formatTime(learningStats.averageSessionTime)} per session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningStats.streak.current} days</div>
            <p className="text-xs text-muted-foreground">Longest: {learningStats.streak.longest} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {learningStats.lessonsThisWeek}/{weeklyGoal}
            </div>
            <Progress value={weeklyProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{Math.round(weeklyProgress)}% of weekly goal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {earnedAchievements.length}/{achievements.length}
            </div>
            <p className="text-xs text-muted-foreground">Badges earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Learning Progress</CardTitle>
          <CardDescription>Your progress across all enrolled courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Progress</span>
              <Badge variant={overallProgress === 100 ? "default" : "secondary"}>{Math.round(overallProgress)}%</Badge>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{completedLessons.length} lessons completed</span>
              <span>{totalLessons - completedLessons.length} lessons remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Progress Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Course Progress</CardTitle>
          <CardDescription>Detailed progress for each enrolled course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enrolledCourses.map((course) => {
              const progress = getCourseProgress(course)
              const courseLessons = course.lessons.length
              const courseCompletedLessons = completedLessons.filter((lessonId) =>
                course.lessons.some((lesson) => lesson.id === lessonId),
              ).length

              return (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {courseCompletedLessons} of {courseLessons} lessons completed
                      </p>
                    </div>
                    <Badge variant={progress === 100 ? "default" : "secondary"}>{Math.round(progress)}%</Badge>
                  </div>
                  <Progress value={progress} className="h-2" />
                  {progress === 100 && (
                    <div className="flex items-center space-x-1 text-sm text-primary">
                      <Award className="h-4 w-4" />
                      <span>Course completed!</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Your learning milestones and badges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border ${
                  achievement.earned ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-muted"
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    achievement.earned ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${achievement.earned ? "text-foreground" : "text-muted-foreground"}`}>
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  {achievement.earned && achievement.date && (
                    <p className="text-xs text-primary">Earned on {new Date(achievement.date).toLocaleDateString()}</p>
                  )}
                </div>
                {achievement.earned && <Badge variant="secondary">Earned</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Achievement */}
      {nextAchievement && (
        <Card>
          <CardHeader>
            <CardTitle>Next Achievement</CardTitle>
            <CardDescription>Keep learning to unlock your next badge</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Trophy className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium">{nextAchievement.title}</h4>
                <p className="text-sm text-muted-foreground">{nextAchievement.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Activity</CardTitle>
          <CardDescription>Your learning activity over the past month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }, (_, i) => {
              const date = new Date()
              date.setDate(date.getDate() - (27 - i))
              const hasActivity = Math.random() > 0.3 // Mock activity data
              const intensity = Math.floor(Math.random() * 4) + 1 // 1-4 intensity levels

              return (
                <div
                  key={i}
                  className={`aspect-square rounded-sm border text-xs flex items-center justify-center ${
                    hasActivity ? `bg-primary/${intensity * 25} border-primary/20` : "bg-muted/30 border-muted"
                  }`}
                  title={`${date.toLocaleDateString()}: ${hasActivity ? `${intensity} lessons` : "No activity"}`}
                >
                  {date.getDate()}
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>Less</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-sm bg-muted/30 border border-muted"></div>
              <div className="w-3 h-3 rounded-sm bg-primary/25 border border-primary/20"></div>
              <div className="w-3 h-3 rounded-sm bg-primary/50 border border-primary/20"></div>
              <div className="w-3 h-3 rounded-sm bg-primary/75 border border-primary/20"></div>
              <div className="w-3 h-3 rounded-sm bg-primary border border-primary/20"></div>
            </div>
            <span>More</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
