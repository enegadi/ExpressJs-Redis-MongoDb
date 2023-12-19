import { Request, Response, NextFunction } from "express";
import redisClient from "../utils/redisClient";

// Middleware function to check if the requested data is already cached in Redis
export const cacheCheckerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if the requested data exists in the Redis cache
    const cachedData = await redisClient.get(req.originalUrl);
    if (cachedData) {
      res.send(JSON.parse(cachedData)); // Send the cached data as the response
    } else {
      next(); 
    }
  } catch (error) {
    console.error(error); 
    return res.status(500).json({ message: "Server error" });
  }
};
