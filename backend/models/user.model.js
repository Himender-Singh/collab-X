import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    gender: { type: String, enum: ['male', 'female'] },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    leetcode: { type: String, default: '' },
    github: { type: String, default: '', unique: true },
    linkedin: { type: String, default: '' },
    twiter: { type: String, default: '' },
    address: { type: String, default: '' },
    check: {type : Boolean, default: false},
    college: { type: String, default: '' },
    experience: { type: String, default: '' }, 
    skills: [{ type: String }],              
    role: { type: String, enum: ['student', 'counselor']},
    sessions: { type: Number, default: 0 }    
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
