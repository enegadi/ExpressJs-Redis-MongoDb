import express, { Request, Response, NextFunction } from "express";
import { getUserById, getUsers } from "../controllers/userController";
import { cacheCheckerMiddleware } from "../middlewares/cacheCheckerMiddleware";
import { userDataSaverMiddleware } from "../middlewares/userDataSaverMiddleware";

const router = express.Router();

router.get("/", cacheCheckerMiddleware, getUsers);
router.get("/:userId", cacheCheckerMiddleware, getUserById);

export default router;
