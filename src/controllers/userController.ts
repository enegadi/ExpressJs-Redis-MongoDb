import { Request, Response } from "express";
import axiosInstance from "../services/axiosInstance";
import redisClient from "../utils/redisClient";
import { PrismaClient } from "@prisma/client";
import User from "../entites/User";

const prisma = new PrismaClient();

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const response = await axiosInstance.get<User[]>("/users");
    const usersData = response.data;

    if (usersData.length > 0) {
      await Promise.all(
        usersData.map(async (user: User) => {
          try {
            // Check if a user with the same ID exists
            const existingUser = await prisma.user.findUnique({
              where: { id: user.id },
            });

            if (!existingUser) {
              // User with the same ID already exists, update it
              await prisma.user.create({ data: user });
            }
          } catch (error) {
            // Handle the error, log it, or take appropriate action
            console.error("Error creating/updating user:", error);
          }
        })
      );
      console.log("Data added to 'User' Document");
    }

    redisClient.SETEX(req.originalUrl, 3600, JSON.stringify(usersData));
    res.send(usersData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing or invalid" });
    }

    const response = await axiosInstance.get<User>(`/users/${userId}`);
    const newUser = response.data;

    // Check if the user exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
    });

    if (!existingUser) {
      // Create the user in the database
      await prisma.user.create({ data: newUser });

      console.log("Data added to 'User' Document");
    }

    // Set data in Redis with a 60-second expiration
    redisClient.SETEX(
      req.originalUrl,
      60,
      JSON.stringify(existingUser || newUser)
    );

    // Respond with the existing or newly created user
    res.json(existingUser || newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
