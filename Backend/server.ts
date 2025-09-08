import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import connectDB from "./config/db";
// import swaggerUi from "swagger-ui-express";
// import swaggerSpec from "./swagger";
import publicRoutes from "./routes/publicRoutes";
import privateRoutes from "./routes/privateRoutes";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize());

// Cors Headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authorization"
  );
  next();
});

// Swagger UI route
// app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use public routes (Unauthenticated)
app.use("/api", publicRoutes);

// Use private routes (Authenticated)
app.use("/api", privateRoutes);

// Error handling middleware
app.use(
  (err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
);

// Start the server only if run directly
if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
