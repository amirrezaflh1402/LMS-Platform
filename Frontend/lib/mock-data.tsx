export interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  enrolledCourses?: string[];
  completedLessons?: string[];
  createdAt?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  lessons: Lesson[];
  enrolledStudents: number;
}
export interface UserStats {
  enrolledCoursesCount: number;
  completedLessonsCount: number;
  totalLessons: number;
  overallProgress: number;
  learningTime: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  order: number;
}

export interface ProgressEntry {
  lessonId: string;
  completedAt: string;
  timeSpent: number; // in minutes
  progress: number; // percentage
}

export interface LearningSession {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  startTime: string;
  endTime: string;
  timeSpent: number; // in minutes
  completed: boolean;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "React Fundamentals",
    description:
      "Learn the basics of React including components, props, state, and hooks.",
    instructor: "Sarah Johnson",
    thumbnail: "/react-programming-course-thumbnail.jpg",
    duration: "8 hours",
    level: "Beginner",
    price: 99,
    enrolledStudents: 1234,
    lessons: [
      {
        id: "1-1",
        title: "Introduction to React",
        description: "Overview of React and its ecosystem",
        duration: "15 min",
        videoUrl: "https://example.com/video1",
        order: 1,
      },
      {
        id: "1-2",
        title: "Components and JSX",
        description: "Understanding React components and JSX syntax",
        duration: "25 min",
        videoUrl: "https://example.com/video2",
        order: 2,
      },
      {
        id: "1-3",
        title: "Props and State",
        description: "Managing data in React components",
        duration: "30 min",
        videoUrl: "https://example.com/video3",
        order: 3,
      },
      {
        id: "course-1-final",
        title: "Final Quiz",
        description: "Final quiz for React Fundamentals course",
        duration: "0 min",
        videoUrl: "",
        order: 4,
      },
    ],
  },
  {
    id: "2",
    title: "Advanced JavaScript",
    description:
      "Master advanced JavaScript concepts including closures, promises, and async/await.",
    instructor: "Mike Chen",
    thumbnail: "/javascript-programming-course-thumbnail.jpg",
    duration: "12 hours",
    level: "Advanced",
    price: 149,
    enrolledStudents: 856,
    lessons: [
      {
        id: "2-1",
        title: "Closures and Scope",
        description: "Deep dive into JavaScript closures",
        duration: "40 min",
        videoUrl: "https://example.com/video4",
        order: 1,
      },
      {
        id: "2-2",
        title: "Promises and Async/Await",
        description: "Handling asynchronous operations",
        duration: "35 min",
        videoUrl: "https://example.com/video5",
        order: 2,
      },
      {
        id: "course-2-final",
        title: "Final Quiz",
        description: "Final quiz for Advanced JavaScript course",
        duration: "0 min",
        videoUrl: "",
        order: 3,
      },
    ],
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    description:
      "Learn the fundamentals of user interface and user experience design.",
    instructor: "Emily Rodriguez",
    thumbnail: "/ui-ux-design-course-thumbnail.jpg",
    duration: "6 hours",
    level: "Beginner",
    price: 79,
    enrolledStudents: 2103,
    lessons: [
      {
        id: "3-1",
        title: "Design Thinking Process",
        description: "Understanding the design thinking methodology",
        duration: "20 min",
        videoUrl: "https://example.com/video6",
        order: 1,
      },
      {
        id: "3-2",
        title: "Color Theory and Typography",
        description: "Fundamentals of visual design",
        duration: "30 min",
        videoUrl: "https://example.com/video7",
        order: 2,
      },
      {
        id: "course-3-final",
        title: "Final Quiz",
        description: "Final quiz for UI/UX Design Principles course",
        duration: "0 min",
        videoUrl: "",
        order: 3,
      },
    ],
  },
];

// export const mockUsers: User[] = [
//   {
//     id: "1",
//     name: "John Doe",
//     email: "john@example.com",
//     role: "student",
//     enrolledCourses: ["1", "3"],
//     completedLessons: ["1-1", "1-2", "3-1"],
//   },
//   {
//     id: "2",
//     name: "Jane Smith",
//     email: "jane@example.com",
//     role: "admin",
//     enrolledCourses: [],
//     completedLessons: [],
//   },
//   {
//     id: "admin",
//     name: "Admin User",
//     email: "admin@admin.com",
//     role: "admin",
//     enrolledCourses: [],
//     completedLessons: [],
//   },
//   {
//     id: "3",
//     name: "Bob Wilson",
//     email: "bob@example.com",
//     role: "student",
//     enrolledCourses: ["2"],
//     completedLessons: ["2-1"],
//   },
// ];

export const mockProgressData: ProgressEntry[] = [
  {
    lessonId: "1-1",
    completedAt: "2024-01-15T10:30:00Z",
    timeSpent: 18,
    progress: 100,
  },
  {
    lessonId: "1-2",
    completedAt: "2024-01-16T14:20:00Z",
    timeSpent: 25,
    progress: 100,
  },
  {
    lessonId: "3-1",
    completedAt: "2024-01-17T09:15:00Z",
    timeSpent: 22,
    progress: 100,
  },
];

export const mockLearningSessions: LearningSession[] = [
  {
    id: "session-1",
    userId: "1",
    courseId: "1",
    lessonId: "1-1",
    startTime: "2024-01-15T10:30:00Z",
    endTime: "2024-01-15T10:48:00Z",
    timeSpent: 18,
    completed: true,
  },
  {
    id: "session-2",
    userId: "1",
    courseId: "1",
    lessonId: "1-2",
    startTime: "2024-01-16T14:20:00Z",
    endTime: "2024-01-16T14:45:00Z",
    timeSpent: 25,
    completed: true,
  },
];

export const mockQuizzes: Quiz[] = [
  {
    id: "quiz-course-1",
    lessonId: "course-1-final", // Final quiz for React course
    title: "React Fundamentals Final Quiz",
    questions: [
      {
        id: "q1",
        question: "What is React?",
        options: [
          "A JavaScript library for building user interfaces",
          "A database management system",
          "A CSS framework",
          "A server-side programming language",
        ],
        correctAnswer: 0,
        explanation:
          "React is a JavaScript library developed by Facebook for building user interfaces, particularly web applications.",
      },
      {
        id: "q2",
        question: "What does JSX stand for?",
        options: [
          "JavaScript XML",
          "Java Syntax Extension",
          "JSON XML",
          "JavaScript Extension",
        ],
        correctAnswer: 0,
        explanation:
          "JSX stands for JavaScript XML and allows you to write HTML-like syntax in JavaScript.",
      },
      {
        id: "q3",
        question: "How do you create a functional component in React?",
        options: [
          "function MyComponent() { return <div>Hello</div>; }",
          "class MyComponent extends Component { render() { return <div>Hello</div>; } }",
          "const MyComponent = React.createComponent(() => <div>Hello</div>);",
          "React.component('MyComponent', () => <div>Hello</div>);",
        ],
        correctAnswer: 0,
        explanation:
          "Functional components are created using regular JavaScript functions that return JSX.",
      },
      {
        id: "q4",
        question: "What is the purpose of useState hook?",
        options: [
          "To manage component state in functional components",
          "To handle side effects",
          "To optimize performance",
          "To create class components",
        ],
        correctAnswer: 0,
        explanation:
          "useState is a React hook that allows you to add state to functional components.",
      },
    ],
  },
  {
    id: "quiz-course-2",
    lessonId: "course-2-final",
    title: "Advanced JavaScript Final Quiz",
    questions: [
      {
        id: "q5",
        question: "What is a closure in JavaScript?",
        options: [
          "A function that has access to variables in its outer scope",
          "A way to close browser windows",
          "A method to end loops",
          "A type of error handling",
        ],
        correctAnswer: 0,
        explanation:
          "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.",
      },
      {
        id: "q6",
        question: "What does async/await do?",
        options: [
          "Makes asynchronous code look synchronous",
          "Creates new threads",
          "Speeds up code execution",
          "Handles errors automatically",
        ],
        correctAnswer: 0,
        explanation:
          "async/await is syntactic sugar that makes asynchronous code easier to read and write by making it look more like synchronous code.",
      },
    ],
  },
  {
    id: "quiz-course-3",
    lessonId: "course-3-final",
    title: "UI/UX Design Principles Final Quiz",
    questions: [
      {
        id: "q7",
        question: "What is the main goal of UX design?",
        options: [
          "To create meaningful and relevant experiences for users",
          "To make things look pretty",
          "To use the latest design trends",
          "To minimize development costs",
        ],
        correctAnswer: 0,
        explanation:
          "UX design focuses on creating meaningful and relevant experiences for users by understanding their needs and behaviors.",
      },
      {
        id: "q8",
        question: "What is the 60-30-10 rule in color theory?",
        options: [
          "60% dominant color, 30% secondary color, 10% accent color",
          "60% text, 30% images, 10% white space",
          "60% content, 30% navigation, 10% footer",
          "60% mobile, 30% tablet, 10% desktop",
        ],
        correctAnswer: 0,
        explanation:
          "The 60-30-10 rule is a color scheme guideline where 60% is the dominant color, 30% is secondary, and 10% is accent color.",
      },
    ],
  },
];
