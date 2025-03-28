import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  task: {
    type: String,
    required: true,
  },
  desc:{
    type: String,
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  isTaskDone: {
    type: Boolean,
    default: false,
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
 },
});

export const Task = mongoose.model("Task", taskSchema);

