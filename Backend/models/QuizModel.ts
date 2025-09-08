import mongoose, { Schema, Document, Types } from "mongoose";

export interface IQuiz extends Document {
  _id: Types.ObjectId;
  lesson: mongoose.Types.ObjectId;
  question: string;
  options: string[];
  correctAnswer: number;
}
const { ObjectId: createID } = Types;
const QuizSchema = new Schema<IQuiz>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new createID(),
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Quiz ||
  mongoose.model<IQuiz>("Quiz", QuizSchema);
