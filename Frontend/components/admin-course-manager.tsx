import type React from "react";
import { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockCourses, type Course, type Lesson } from "@/lib/mock-data";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  DollarSign,
  Video,
  HelpCircle,
  X,
} from "lucide-react";

export function AdminCourseManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    instructor: "",
    level: "Beginner" as const,
    price: 0,
    duration: "",
    thumbnail: "",
    lessons: [] as Lesson[],
  });

  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    duration: "",
    videoUrl: "",
    type: "video" as "video" | "quiz",
  });

  const [newQuiz, setNewQuiz] = useState({
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
      },
    ],
  });

  const handleAddCourse = () => {
    const course: Course = {
      id: Math.random().toString(36).substr(2, 9),
      ...newCourse,
      thumbnail: newCourse.thumbnail || "/online-learning-platform.png",
      enrolledStudents: 0,
    };
    setCourses([...courses, course]);
    setNewCourse({
      title: "",
      description: "",
      instructor: "",
      level: "Beginner",
      price: 0,
      duration: "",
      thumbnail: "",
      lessons: [],
    });
    setIsAddDialogOpen(false);
  };

  const handleAddQuizQuestion = () => {
    setNewQuiz({
      questions: [
        ...newQuiz.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: "",
        },
      ],
    });
  };

  const handleRemoveQuizQuestion = (index: number) => {
    if (newQuiz.questions.length > 1) {
      setNewQuiz({
        questions: newQuiz.questions.filter((_, i) => i !== index),
      });
    }
  };

  const handleUpdateQuizQuestion = (
    questionIndex: number,
    field: string,
    value: any
  ) => {
    const updatedQuestions = [...newQuiz.questions];
    if (field === "options") {
      updatedQuestions[questionIndex].options = value;
    } else {
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        [field]: value,
      };
    }
    setNewQuiz({ questions: updatedQuestions });
  };

  const handleAddLesson = () => {
    if (newLesson.type === "video") {
      const lesson: Lesson = {
        id: Math.random().toString(36).substr(2, 9),
        title: newLesson.title,
        description: newLesson.description,
        duration: newLesson.duration,
        videoUrl: newLesson.videoUrl,
        type: "video",
      };
      setNewCourse({ ...newCourse, lessons: [...newCourse.lessons, lesson] });
    } else {
      const quizLesson: Lesson = {
        id: Math.random().toString(36).substr(2, 9),
        title: newLesson.title,
        description: newLesson.description,
        duration: "15 minutes",
        type: "quiz",
        quiz: {
          questions: newQuiz.questions.map((q) => ({
            id: Math.random().toString(36).substr(2, 9),
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          })),
        },
      };
      setNewCourse({
        ...newCourse,
        lessons: [...newCourse.lessons, quizLesson],
      });
    }

    setNewLesson({
      title: "",
      description: "",
      duration: "",
      videoUrl: "",
      type: "video",
    });
    setNewQuiz({
      questions: [
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: "",
        },
      ],
    });
  };

  const handleRemoveLesson = (lessonId: string) => {
    setNewCourse({
      ...newCourse,
      lessons: newCourse.lessons.filter((lesson) => lesson.id !== lessonId),
    });
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setNewCourse({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      level: course.level,
      price: course.price,
      duration: course.duration,
      thumbnail: course.thumbnail || "",
      lessons: course.lessons || [],
    });
  };

  const handleUpdateCourse = () => {
    if (!editingCourse) return;

    const updatedCourses = courses.map((course) =>
      course.id === editingCourse.id ? { ...course, ...newCourse } : course
    );
    setCourses(updatedCourses);
    setEditingCourse(null);
    setNewCourse({
      title: "",
      description: "",
      instructor: "",
      level: "Beginner",
      price: 0,
      duration: "",
      thumbnail: "",
      lessons: [],
    });
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(courses.filter((course) => course.id !== courseId));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a service like Vercel Blob
      const imageUrl = URL.createObjectURL(file);
      setNewCourse({ ...newCourse, thumbnail: imageUrl });
    }
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/courses-list", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCourses(data?.courseList);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard stats:", err);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold">Course Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="text-sm md:text-base">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Course</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl">
                Add New Course
              </DialogTitle>
              <DialogDescription className="text-sm md:text-base">
                Create a new course with lessons and quizzes
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic" className="text-xs md:text-sm">
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="lessons" className="text-xs md:text-sm">
                  Lessons
                </TabsTrigger>
                <TabsTrigger value="preview" className="text-xs md:text-sm">
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm md:text-base">
                        Course Title
                      </Label>
                      <Input
                        id="title"
                        value={newCourse.title}
                        onChange={(e) =>
                          setNewCourse({ ...newCourse, title: e.target.value })
                        }
                        placeholder="Enter course title"
                        className="text-sm md:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="instructor"
                        className="text-sm md:text-base"
                      >
                        Instructor
                      </Label>
                      <Input
                        id="instructor"
                        value={newCourse.instructor}
                        onChange={(e) =>
                          setNewCourse({
                            ...newCourse,
                            instructor: e.target.value,
                          })
                        }
                        placeholder="Enter instructor name"
                        className="text-sm md:text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thumbnail" className="text-sm md:text-base">
                      Course Banner Image
                    </Label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Input
                          id="thumbnail"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="text-sm md:text-base"
                        />
                      </div>
                      {newCourse.thumbnail && (
                        <div className="w-20 h-12 rounded border overflow-hidden">
                          <img
                            src={newCourse.thumbnail || "/placeholder.svg"}
                            alt="Course banner preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload a banner image for your course (recommended:
                      1200x600px)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm md:text-base"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newCourse.description}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter course description"
                      rows={3}
                      className="text-sm md:text-base"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level" className="text-sm md:text-base">
                        Level
                      </Label>
                      <Select
                        value={newCourse.level}
                        onValueChange={(value: any) =>
                          setNewCourse({ ...newCourse, level: value })
                        }
                      >
                        <SelectTrigger className="text-sm md:text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-sm md:text-base">
                        Price ($)
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        value={newCourse.price}
                        onChange={(e) =>
                          setNewCourse({
                            ...newCourse,
                            price: Number(e.target.value),
                          })
                        }
                        placeholder="0"
                        className="text-sm md:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="duration"
                        className="text-sm md:text-base"
                      >
                        Duration
                      </Label>
                      <Input
                        id="duration"
                        value={newCourse.duration}
                        onChange={(e) =>
                          setNewCourse({
                            ...newCourse,
                            duration: e.target.value,
                          })
                        }
                        placeholder="e.g., 8 hours"
                        className="text-sm md:text-base"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="lessons" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base md:text-lg font-semibold">
                      Course Lessons
                    </h3>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Video
                          className={`h-4 w-4 ${
                            newLesson.type === "video"
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        />
                        <Switch
                          checked={newLesson.type === "quiz"}
                          onCheckedChange={(checked) =>
                            setNewLesson({
                              ...newLesson,
                              type: checked ? "quiz" : "video",
                            })
                          }
                        />
                        <HelpCircle
                          className={`h-4 w-4 ${
                            newLesson.type === "quiz"
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {newLesson.type === "video" ? "Video" : "Quiz"}
                      </span>
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base md:text-lg flex items-center">
                        {newLesson.type === "video" ? (
                          <Video className="h-4 w-4 mr-2 text-blue-500" />
                        ) : (
                          <HelpCircle className="h-4 w-4 mr-2 text-blue-500" />
                        )}
                        Add{" "}
                        {newLesson.type === "video"
                          ? "Video Lesson"
                          : "Quiz Lesson"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm md:text-base">
                            Lesson Title
                          </Label>
                          <Input
                            value={newLesson.title}
                            onChange={(e) =>
                              setNewLesson({
                                ...newLesson,
                                title: e.target.value,
                              })
                            }
                            placeholder="Enter lesson title"
                            className="text-sm md:text-base"
                          />
                        </div>
                        {newLesson.type === "video" && (
                          <div className="space-y-2">
                            <Label className="text-sm md:text-base">
                              Duration
                            </Label>
                            <Input
                              value={newLesson.duration}
                              onChange={(e) =>
                                setNewLesson({
                                  ...newLesson,
                                  duration: e.target.value,
                                })
                              }
                              placeholder="e.g., 15 minutes"
                              className="text-sm md:text-base"
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm md:text-base">
                          Description
                        </Label>
                        <Textarea
                          value={newLesson.description}
                          onChange={(e) =>
                            setNewLesson({
                              ...newLesson,
                              description: e.target.value,
                            })
                          }
                          placeholder="Enter lesson description"
                          rows={2}
                          className="text-sm md:text-base"
                        />
                      </div>

                      {newLesson.type === "video" ? (
                        <div className="space-y-2">
                          <Label className="text-sm md:text-base">
                            Video URL
                          </Label>
                          <Input
                            value={newLesson.videoUrl}
                            onChange={(e) =>
                              setNewLesson({
                                ...newLesson,
                                videoUrl: e.target.value,
                              })
                            }
                            placeholder="Enter video URL or upload link"
                            className="text-sm md:text-base"
                          />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm md:text-base">
                              Quiz Questions
                            </Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleAddQuizQuestion}
                              className="text-xs bg-transparent"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Question
                            </Button>
                          </div>

                          {newQuiz.questions.map((question, questionIndex) => (
                            <Card key={questionIndex} className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium">
                                  Question {questionIndex + 1}
                                </h4>
                                {newQuiz.questions.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleRemoveQuizQuestion(questionIndex)
                                    }
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>

                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <Label className="text-sm">Question</Label>
                                  <Textarea
                                    value={question.question}
                                    onChange={(e) =>
                                      handleUpdateQuizQuestion(
                                        questionIndex,
                                        "question",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter quiz question"
                                    rows={2}
                                    className="text-sm"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm">
                                    Answer Options
                                  </Label>
                                  {question.options.map(
                                    (option, optionIndex) => (
                                      <div
                                        key={optionIndex}
                                        className="flex items-center space-x-2"
                                      >
                                        <Input
                                          value={option}
                                          onChange={(e) => {
                                            const newOptions = [
                                              ...question.options,
                                            ];
                                            newOptions[optionIndex] =
                                              e.target.value;
                                            handleUpdateQuizQuestion(
                                              questionIndex,
                                              "options",
                                              newOptions
                                            );
                                          }}
                                          placeholder={`Option ${
                                            optionIndex + 1
                                          }`}
                                          className="text-sm"
                                        />
                                        <Button
                                          type="button"
                                          variant={
                                            question.correctAnswer ===
                                            optionIndex
                                              ? "default"
                                              : "outline"
                                          }
                                          size="sm"
                                          onClick={() =>
                                            handleUpdateQuizQuestion(
                                              questionIndex,
                                              "correctAnswer",
                                              optionIndex
                                            )
                                          }
                                          className="text-xs whitespace-nowrap"
                                        >
                                          Correct
                                        </Button>
                                      </div>
                                    )
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm">Explanation</Label>
                                  <Textarea
                                    value={question.explanation}
                                    onChange={(e) =>
                                      handleUpdateQuizQuestion(
                                        questionIndex,
                                        "explanation",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Explain why this is the correct answer"
                                    rows={2}
                                    className="text-sm"
                                  />
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}

                      <Button
                        onClick={handleAddLesson}
                        className="w-full text-sm md:text-base"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add{" "}
                        {newLesson.type === "video"
                          ? "Video Lesson"
                          : "Quiz Lesson"}
                      </Button>
                    </CardContent>
                  </Card>

                  {newCourse.lessons.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base md:text-lg">
                          Course Lessons ({newCourse.lessons.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {newCourse.lessons.map((lesson, index) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                {lesson.type === "video" ? (
                                  <Video className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <HelpCircle className="h-4 w-4 text-green-500" />
                                )}
                                <div>
                                  <p className="font-medium text-sm md:text-base">
                                    {lesson.title}
                                  </p>
                                  <p className="text-xs md:text-sm text-muted-foreground">
                                    {lesson.type === "video"
                                      ? `Video • ${lesson.duration}`
                                      : "Quiz"}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveLesson(lesson.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base md:text-lg">
                      Course Preview
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base">
                      Review your course before publishing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-base md:text-lg">
                        {newCourse.title || "Course Title"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        by {newCourse.instructor || "Instructor"}
                      </p>
                      <p className="text-sm md:text-base mt-2">
                        {newCourse.description || "Course description"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs md:text-sm">
                        {newCourse.level}
                      </Badge>
                      <Badge variant="outline" className="text-xs md:text-sm">
                        ${newCourse.price}
                      </Badge>
                      <Badge variant="outline" className="text-xs md:text-sm">
                        {newCourse.duration}
                      </Badge>
                      <Badge variant="outline" className="text-xs md:text-sm">
                        {newCourse.lessons.length} lessons
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="text-sm md:text-base"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddCourse}
                className="text-sm md:text-base"
              >
                Add Course
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Course Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">All Courses</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Manage all courses on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs md:text-sm">Course</TableHead>
                  <TableHead className="text-xs md:text-sm">
                    Instructor
                  </TableHead>
                  <TableHead className="text-xs md:text-sm">Level</TableHead>
                  <TableHead className="text-xs md:text-sm">Price</TableHead>
                  <TableHead className="text-xs md:text-sm">Students</TableHead>
                  <TableHead className="text-xs md:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses&&courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-xs md:text-sm">
                          {course.title}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1 md:block hidden">
                          {course.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs md:text-sm">
                      {course.instructor}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {course.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-xs md:text-sm">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {course.price}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-xs md:text-sm">
                        <Users className="h-3 w-3 mr-1" />
                        {course.enrolledStudents}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditCourse(course)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Course Dialog */}
      <Dialog
        open={!!editingCourse}
        onOpenChange={() => setEditingCourse(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>Update course information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Course Title</Label>
                <Input
                  id="edit-title"
                  value={newCourse.title}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title: e.target.value })
                  }
                  placeholder="Enter course title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-instructor">Instructor</Label>
                <Input
                  id="edit-instructor"
                  value={newCourse.instructor}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, instructor: e.target.value })
                  }
                  placeholder="Enter instructor name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                placeholder="Enter course description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-level">Level</Label>
                <Select
                  value={newCourse.level}
                  onValueChange={(value: any) =>
                    setNewCourse({ ...newCourse, level: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={newCourse.price}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      price: Number(e.target.value),
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration</Label>
                <Input
                  id="edit-duration"
                  value={newCourse.duration}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, duration: e.target.value })
                  }
                  placeholder="e.g., 8 hours"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditingCourse(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCourse}>Update Course</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
