import { Request, Response } from "express";
import axiosInstance from "../services/axiosInstance";
import prisma from "../config/prismaInstance";
import { Post } from "../interfaces/Post";
import saveSinglePost from "../helpers/saveSinglePost";
import addDataToRedis from "../helpers/cacheDataInRedis";

export const getPosts = async (req: Request, res: Response) => {
  try {
    // Fetch posts from the external API
    const { data: posts } = await axiosInstance.get<Post[]>("/posts");

    // Fetch all posts from the database
    const postsInDb = await prisma.post.findMany();

    // Identify which posts are not in the database
    const postsToSave = posts.filter(
      (externalPost) =>
        !postsInDb.some((dbPost) => dbPost.id === externalPost.id)
    );

    // Save posts that are not in the database
    await Promise.all(postsToSave.map((post) => saveSinglePost(post.id)));

    // Retrieve all the posts in the database
    const updatedPostsInDb = await prisma.post.findMany();

    // Store all posts in Redis with a time-to-live of 1 hour
    addDataToRedis(req.originalUrl, 3600, updatedPostsInDb);

    // Send the posts in the database as the response
    res.json(updatedPostsInDb);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    // Check if the post is already in the database
    let existingPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    //if the post does not exist in the database add it
    if (!existingPost) {
      existingPost = await saveSinglePost(postId);
    }
    //add the post to Redis
    addDataToRedis(req.originalUrl, 100, existingPost);
    res.json(existingPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
