import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILesson extends Document {
  _id: Types.ObjectId;
  title: string;
  videoUrl: string;
  description: string;
  course: mongoose.Types.ObjectId;
  quizzes: mongoose.Types.ObjectId[];
  order: number;
}
const { ObjectId: createID } = Types;
const LessonSchema = new Schema<ILesson>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new createID(),
    },
    title: { type: String, required: true },
    videoUrl: { type: String },
    description: { type: String },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Lesson ||
  mongoose.model<ILesson>("Lesson", LessonSchema);
