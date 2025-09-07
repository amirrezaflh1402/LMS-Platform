import mongoose, { Schema, Document } from "mongoose";

export interface IQuiz extends Document {
  lesson: mongoose.Types.ObjectId;
  question: string;
  options: string[];
  correctAnswer: number;
}

const QuizSchema = new Schema<IQuiz>(
  {
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);
