import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { 
  addComment,
  addNewPost,
  bookmarkPost,
  deletePost,
  dislikePost,
  getAllPost,
  getCommentsOfPost,
  getUserPost,
  likePost,
  addReplyToComment,
  getRepliesForComment,
} from "../controllers/post.controller.js";

const router = express.Router();

// Existing routes
router.route("/addpost").post(isAuthenticated, upload.single('file'), addNewPost);
router.route("/all").get(isAuthenticated, getAllPost);
router.route("/userpost/all").get(isAuthenticated, getUserPost);
router.route("/:id/like").get(isAuthenticated, likePost);
router.route("/:id/dislike").get(isAuthenticated, dislikePost);
router.route("/delete/:id").delete(isAuthenticated, deletePost);
router.route("/:id/bookmark").get(isAuthenticated, bookmarkPost);

// Comment routes (updated)
router.route("/:id/comment").post(isAuthenticated, addComment); 
router.route("/:id/comment/all").get(isAuthenticated, getCommentsOfPost); // Changed from POST to GET

// New reply routes
router.route("/:postId/comment/:commentId/reply").post(isAuthenticated, addReplyToComment);
router.route("/comment/:commentId/replies").get(isAuthenticated, getRepliesForComment);

export default router;