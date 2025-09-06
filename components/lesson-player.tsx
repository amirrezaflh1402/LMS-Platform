"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, CheckCircle, Clock } from "lucide-react"
import type { Lesson } from "@/lib/mock-data"

interface LessonPlayerProps {
  lesson: Lesson
  isCompleted: boolean
  onComplete: (lessonId: string, timeSpent: number) => void
  onProgress?: (lessonId: string, progress: number) => void
}

export function LessonPlayer({ lesson, isCompleted, onComplete, onProgress }: LessonPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [lessonProgress, setLessonProgress] = useState(0)

  // Mock lesson duration in seconds (convert from "15 min" format)
  const totalDuration = Number.parseInt(lesson.duration) * 60 || 900 // Default 15 minutes

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying && !isCompleted) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 1
          const progress = (newTime / totalDuration) * 100
          setLessonProgress(progress)
          setTimeSpent((prevSpent) => prevSpent + 1)

          // Call progress callback
          onProgress?.(lesson.id, progress)

          // Auto-complete when reaching 80% of the lesson
          if (progress >= 80 && !isCompleted) {
            handleComplete()
          }

          return newTime >= totalDuration ? totalDuration : newTime
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, isCompleted, lesson.id, totalDuration, onProgress])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleComplete = () => {
    setIsPlaying(false)
    onComplete(lesson.id, Math.floor(timeSpent / 60)) // Convert to minutes
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className={`${isCompleted ? "bg-muted/30" : ""}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center space-x-2">
              <span>{lesson.title}</span>
              {isCompleted && <CheckCircle className="h-5 w-5 text-primary" />}
            </CardTitle>
            <CardDescription>{lesson.description}</CardDescription>
          </div>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{lesson.duration}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mock Video Player */}
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
          <div className="relative z-10 text-center">
            <div className="text-4xl font-bold text-foreground mb-2">
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </div>
            <p className="text-muted-foreground">Mock Video Player</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Lesson Progress</span>
            <span>{Math.round(lessonProgress)}%</span>
          </div>
          <Progress value={lessonProgress} className="h-2" />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button size="sm" onClick={handlePlayPause} disabled={isCompleted} className="flex items-center space-x-1">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </Button>

            {lessonProgress >= 80 && !isCompleted && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleComplete}
                className="flex items-center space-x-1 bg-transparent"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Mark Complete</span>
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Time spent: {formatTime(timeSpent)}</span>
          </div>
        </div>

        {isCompleted && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-primary">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Lesson completed!</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Great job! You've successfully completed this lesson.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
