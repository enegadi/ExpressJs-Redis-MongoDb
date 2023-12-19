import { Request, Response } from "express";
import axiosInstance from "../services/axiosInstance";
import redisClient from "../utils/redisClient";
import { PrismaClient } from "@prisma/client";
import User from "../entites/User";

const prisma = new PrismaClient();

/**
 * Get all users function
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    // Fetch users data from external API
    const response = await axiosInstance.get<User[]>("/users");
    const usersData = response.data;
    let usersCount = 0;
    if (usersData.length > 0) {
      await Promise.all(
        usersData.map(async (user: User) => {
          try {
            // Check if a user with the same ID exists in the database
            const existingUser = await prisma.user.findUnique({
              where: { id: user.id },
            });

            if (!existingUser) {
              // User with the same ID does not exist, create it
              await prisma.user.create({ data: user });
              usersCount += 1;
            }

            if (usersCount != 0) {
              console.log(usersCount + " Users added to DB");
            }
          } catch (error) {
            // Handle the error, log it, or take appropriate action
            console.error("Error creating/updating user:", error);
          }
        })
      );
    }

    // Store users data in Redis with a 1-hour expiration
    redisClient.SETEX(req.originalUrl, 3600, JSON.stringify(usersData));

    // Send the users data as the response
    res.send(usersData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get user by ID
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    // Check if the ID parameter is missing or invalid
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing or invalid" });
    }

    // Fetch user data from external API
    const response = await axiosInstance.get<User>(`/users/${userId}`);
    const newUser = response.data;

    // Check if the user exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { id: newUser.id },
    });

    if (!existingUser) {
      // User does not exist in the database, create it
      await prisma.user.create({ data: newUser });

      console.log("User added to DB");
    }

    // Store user data in Redis with a 60-second expiration
    redisClient.SETEX(req.originalUrl, 60, JSON.stringify(newUser));

    // Respond with the existing or newly created user
    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
