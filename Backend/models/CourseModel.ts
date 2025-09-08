import mongoose, { Schema, Document, Types } from "mongoose";

interface ILesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  order: number;
}

export interface ICourse extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  instructor: mongoose.Schema.Types.ObjectId;
  lessons: ILesson[];
  students: mongoose.Types.ObjectId[];
  category: string;
  level: string;
  thumbnail: string;
  duration: string;
  price: number;
  enrolledStudents: number;
}

const LessonSchema = new Schema<ILesson>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: String },
    videoUrl: { type: String },
    order: { type: Number },
  },
  { _id: false }
);

const CourseSchema = new Schema<ICourse>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    title: { type: String, required: true },
    description: { type: String },
    instructor: { type: mongoose.Schema.Types.ObjectId, required: true }, // Changed to string
    lessons: [LessonSchema], // Embedded lessons
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    category: { type: String },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    thumbnail: { type: String },
    duration: { type: String },
    price: { type: Number },
    enrolledStudents: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.models.Course ||
  mongoose.model<ICourse>("Course", CourseSchema);
