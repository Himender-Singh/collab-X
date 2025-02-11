import { Chat } from "../models/chat.model.js";
import { chatConversation } from "../models/chatConversation.model.js";

// for creating a new chat
export const createChat = async (req, res) => {
  try {
    const userId = req.id;
    // console.log(req.id);

    const chat = await Chat.create({
      user: userId,
    });

    res.json(chat);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// for getting chats for sidebar
export const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.id }).sort({
      createdAt: -1,
    });

    res.json(chats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// for adding the chat from main window
export const addConversation = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat)
      return res.status(404).json({
        message: "No chat with this id",
      });

    const conversation = await chatConversation.create({
      chat: chat._id,
      question: req.body.question,
      answer: req.body.answer,
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      req.params.id,
      { latestMessage: req.body.question },
      { new: true }
    );

    res.json({
      conversation,
      updatedChat,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// for getting the chats of window
export const getConversation = async (req, res) => {
  try {
    const conversation = await chatConversation.find({ chat: req.params.id });

    if (!conversation)
      return res.status(404).json({
        message: "No conversation with this id",
      });

    res.json(conversation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// for deleting the chats
export const deletChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat)
      return res.status(404).json({
        message: "No chat with this id",
      });

    if (chat.user.toString() !== req.id.toString())
      return res.status(403).json({
        message: "Unauthorized",
      });

    await chat.deleteOne();

    res.json({
      message: "Chat Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
