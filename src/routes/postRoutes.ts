import express from "express";
import { cacheCheckerMiddleware } from "../middlewares/cacheCheckerMiddleware";
import {
  getPostById,
  getPostCommentsById,
  getPosts,
} from "../controllers/postController";

const router = express.Router();

router.get("/", cacheCheckerMiddleware, getPosts);
router.get("/:id", cacheCheckerMiddleware, getPostById);
router.get("/:postId/comments", cacheCheckerMiddleware, getPostCommentsById);

export default router;
