import { Request, Response } from "express";
import axiosInstance from "../services/axiosInstance";
import redisClient from "../utils/redisClient";

// Function to get all posts
export const getPosts = async (req: Request, res: Response) => {
  try {
    const response = await axiosInstance.get("/posts");
    redisClient.SETEX(req.originalUrl, 3600, JSON.stringify(response.data));
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Function to get a post by its ID
export const getPostById = async (req: Request, res: Response) => {
  try {
    const response = await axiosInstance.get("/posts/" + req.params.id);
    redisClient.SETEX(req.originalUrl, 3600, JSON.stringify(response.data));
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Function to get comments for a specific post
export const getPostCommentsById = async (req: Request, res: Response) => {
  try {
    const response = await axiosInstance.get("/comments", {
      params: { postId: req.params.postId },
    });
    redisClient.SETEX(req.originalUrl, 3600, JSON.stringify(response.data));
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
