import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb+srv://amirrezaflh:amir4890407871@cluster17751.oo5di.mongodb.net/?retryWrites=true&w=majority&appName=Cluster17751";

    await mongoose.connect(mongoUri, {
      // mongoose 7+ no longer needs useNewUrlParser / useUnifiedTopology
    });

    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if DB connection fails
  }
};

export default connectDB;
