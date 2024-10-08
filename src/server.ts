import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import { corsConfig } from "./config/cors"
import { connectDB } from "./config/db"
import authRoutes from "./routes/auth-routes"
import projectRoutes from "./routes/project-routes"

dotenv.config();
connectDB();
const app = express();
app.use(cors(corsConfig));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

export default app;
