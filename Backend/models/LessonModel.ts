import mongoose, { Schema, Document } from "mongoose";

export interface ILesson extends Document {
  title: string;
  videoUrl: string;
  description: string;
  course: mongoose.Types.ObjectId;
  quizzes: mongoose.Types.ObjectId[];
  order: number;
}

const LessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true },
    videoUrl: { type: String },
    description: { type: String },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", LessonSchema);
