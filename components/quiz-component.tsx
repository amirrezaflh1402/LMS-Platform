"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Trophy } from "lucide-react"
import type { Quiz } from "@/lib/mock-data"

interface QuizComponentProps {
  quiz: Quiz
  onComplete: (score: number, totalQuestions: number) => void
}

export function QuizComponent({ quiz, onComplete }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate score and show results
      const correctAnswers = quiz.questions.reduce((acc, question, index) => {
        return acc + (selectedAnswers[index] === question.correctAnswer ? 1 : 0)
      }, 0)
      setScore(correctAnswers)
      setShowResults(true)
      onComplete(correctAnswers, quiz.questions.length)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setShowResults(false)
    setScore(0)
  }

  if (showResults) {
    const percentage = Math.round((score / quiz.questions.length) * 100)
    const passed = percentage >= 70

    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {passed ? <Trophy className="h-16 w-16 text-yellow-500" /> : <XCircle className="h-16 w-16 text-red-500" />}
          </div>
          <CardTitle className="text-2xl">{passed ? "Congratulations!" : "Keep Learning!"}</CardTitle>
          <CardDescription>
            You scored {score} out of {quiz.questions.length} questions ({percentage}%)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {quiz.questions.map((question, index) => {
              const userAnswer = selectedAnswers[index]
              const isCorrect = userAnswer === question.correctAnswer

              return (
                <div key={question.id} className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{question.question}</p>
                      <p className="text-sm text-muted-foreground mt-1">Your answer: {question.options[userAnswer]}</p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600 mt-1">
                          Correct answer: {question.options[question.correctAnswer]}
                        </p>
                      )}
                      {question.explanation && (
                        <p className="text-sm text-muted-foreground mt-2 italic">{question.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={resetQuiz} variant="outline">
              Retake Quiz
            </Button>
            <Button onClick={() => onComplete(score, quiz.questions.length)}>Continue Learning</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </Badge>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <CardTitle className="text-lg">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left border rounded-lg transition-colors hover:bg-muted/50 ${
                selectedAnswers[currentQuestion] === index ? "border-primary bg-primary/10" : "border-border"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestion] === index
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground"
                  }`}
                >
                  {selectedAnswers[currentQuestion] === index && <div className="w-2 h-2 rounded-full bg-current" />}
                </div>
                <span className="text-sm">{option}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-between pt-4">
          <Button onClick={handlePrevious} disabled={currentQuestion === 0} variant="outline">
            Previous
          </Button>
          <Button onClick={handleNext} disabled={selectedAnswers[currentQuestion] === undefined}>
            {currentQuestion === quiz.questions.length - 1 ? "Finish Quiz" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
