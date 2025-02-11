import express from "express";
import { addTask, getAllUserTasks, getTaskById } from "../controllers/task.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Route to add a new task
router.post('/addTask', isAuthenticated, addTask);

// Route to get a specific task by ID
router.get('/getTask/:id', isAuthenticated, getTaskById);

// Route to get all tasks for the authenticated user
router.get('/getUserTask', isAuthenticated, getAllUserTasks);

export default router;
