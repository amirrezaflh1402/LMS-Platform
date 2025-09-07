import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: mongoose.Types.ObjectId;
  lessons: mongoose.Types.ObjectId[];
  students: mongoose.Types.ObjectId[];
  category: string;
  level: string;
  thumbnail: string;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    category: { type: String },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    thumbnail: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
