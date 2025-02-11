import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { addConversation, createChat, deletChat, getAllChats, getConversation } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/new",isAuthenticated,createChat);
router.get("/all",isAuthenticated,getAllChats);
router.post("/:id",isAuthenticated,addConversation);
router.get("/:id",isAuthenticated,getConversation);
router.delete("/:id",isAuthenticated,deletChat);

export default router;