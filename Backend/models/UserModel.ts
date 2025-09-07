import mongoose, { Schema, Document,Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string; // if not Google login
  role: "student" | "instructor" | "admin";
  enrolledCourses: mongoose.Types.ObjectId[];
  progress: {
    course: mongoose.Types.ObjectId;
    completedLessons: mongoose.Types.ObjectId[];
  }[];
}
const { ObjectId: createID } = Types;
const UserSchema = new Schema<IUser>(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, default: () => new createID() },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    progress: [
      {
        course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        completedLessons: [
          { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
