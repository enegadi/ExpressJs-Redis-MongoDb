import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import redisClient from "./config/redisClient";
import userRoute from "./routes/userRoutes";
import postRoute from "./routes/postRoutes";
import morgan from "morgan";

import { PrismaClient } from "@prisma/client";

dotenv.config();
const app: Application = express();
const port = process.env.PORT || 8000;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/users", userRoute);
app.use("/posts", postRoute);

const prismaClient = new PrismaClient();

redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
});
redisClient.connect();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express");
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

process.on("SIGINT", async () => {
  try {
    await prismaClient.$disconnect();
    console.log("MongoDB connection closed. Exiting...");
    process.exit(0);
  } catch (error) {
    console.error("Error closing the MongoDB connection:", error);
    process.exit(1);
  }
});
