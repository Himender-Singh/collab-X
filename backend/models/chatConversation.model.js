import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    question: {
      type: String,
      required:true,
    },
    answer: {
        type: String,
        required:true,
      },
  },
  {
    timestamps: true,
  }
);


export const chatConversation = mongoose.model('chatConversation', conversationSchema);

