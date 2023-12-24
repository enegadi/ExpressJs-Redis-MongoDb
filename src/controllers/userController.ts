import { Request, Response } from "express";
import axiosInstance from "../services/axiosInstance";
import redisClient from "../config/redisClient";
import User from "../interfaces/User";
import cacheDataInRedis from "../helpers/cacheDataInRedis";
import prisma from "../config/prismaInstance";


export const getUsers = async (req: Request, res: Response) => {
  try {
    // Fetch users data from external API
    const response = await axiosInstance.get("/users");
    const usersData: User[] = response.data;
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
          } catch (error) {
            // Handle the error, log it, or take appropriate action
            console.error("Error creatinguser:", error);
          }
        })
      );

      if (usersCount > 0) {
        console.log(usersCount + " Users added to DB");
      }
    }

    // Store users data in Redis with a 1-hour expiration
    cacheDataInRedis(req.originalUrl, 3600, usersData);

    // Send the users data as the response
    res.json(usersData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

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
