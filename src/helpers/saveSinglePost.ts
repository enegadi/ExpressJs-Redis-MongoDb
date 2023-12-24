import axiosInstance from "../services/axiosInstance";
import prisma from "../config/prismaInstance";
import { Comment, Post } from "../interfaces/Post";

/**
 * Saves a single post to the database.
 * @param postId - The ID of the post to be saved.
 * @returns The saved post.
 * @throws If an error occurs during the saving process.
 */
export default async (postId: number): Promise<Post> => {
  try {
    // Fetch the post data from the API
    const post: Post = await axiosInstance
      .get(`/posts/${postId}`)
      .then((res) => res.data);

    // Fetch the comments for the post
    const comments: Comment[] = await axiosInstance
      .get(`/posts/${post.id}/comments`)
      .then((res) => res.data);

    // Assign the comments to the post object
    post.comments = comments;

    // Save the post to the database using Prisma
    await prisma.post
      .create({
        data: post,
      })
      .then(() => console.log(`Post with ID ${post.id} added to the database`));

    // Return the saved post
    return post;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};
