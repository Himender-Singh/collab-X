import express from "express";
import { addTask, getAllUserTasks, getTaskById, updateTask } from "../controllers/task.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Route to add a new task
router.post('/addTask', isAuthenticated, addTask);

// Route to get a specific task by ID
router.get('/getTask/:id', isAuthenticated, getTaskById);

// Route to get all tasks for the authenticated user
router.get('/getUserTask', isAuthenticated, getAllUserTasks);

router.post('/updateTask/:id', isAuthenticated, updateTask);

router.delete('/deleteTask/:id', isAuthenticated, updateTask);

export default router;
