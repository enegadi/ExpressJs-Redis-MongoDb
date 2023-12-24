import express from "express";
import { cacheCheckerMiddleware } from "../middlewares/cacheCheckerMiddleware";
import {
  getPostById,
  getPosts,
} from "../controllers/postController";

const router = express.Router();

router.get("/", cacheCheckerMiddleware, getPosts);
router.get("/:id", cacheCheckerMiddleware, getPostById);

export default router;
