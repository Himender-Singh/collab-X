import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Try different email",
                success: false,
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false,
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' });
        // Populate posts array
        const populatedPosts = await Post.find({ _id: { $in: user.posts }, author: user._id });

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts
        };

        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            message: "An error occurred during login. Please try again later.",
            success: false,
        });
    }
};


export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks');
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender, experience, skills, role, sessions,leetcode,github,linkedin,twiter,address,college,check } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        // Upload profile picture if provided
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        // Find user by ID
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }

        // Update fields if provided
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (experience) user.experience = experience;
        if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim());
        if (role && ['student', 'counselor'].includes(role)) user.role = role;
        if (sessions && Number.isInteger(Number(sessions))) user.sessions = Number(sessions);
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;
        if (leetcode) user.leetcode = leetcode;
        if (github) user.github = github;
        if (twiter) user.twiter = twiter;
        if (linkedin) user.linkedin = linkedin;
        if (address) user.address = address;
        if (college) user.college = college;
        if (check) user.check = check;

        // Save updated user profile
        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'An error occurred while updating profile.',
            success: false
        });
    }
};


export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);
    }
};
export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id; // ID of the user who wants to follow/unfollow
        const jiskoFollowKrunga = req.params.id; // ID of the user to follow/unfollow

        // Prevent users from following themselves
        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        // Fetch the user and target user with populated fields
        const user = await User.findById(followKrneWala).populate('following', 'username profilePicture');
        const targetUser = await User.findById(jiskoFollowKrunga).populate('followers', 'username profilePicture');

        // Check if both users exist
        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }

        // Check if the user is already following the target user
        const isFollowing = user.following.some(follow => follow._id.toString() === jiskoFollowKrunga);

        if (isFollowing) {
            // Unfollow logic
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ]);

            // Refetch the updated user data with populated fields
            const updatedUser = await User.findById(followKrneWala).populate('following', 'username profilePicture');
            return res.status(200).json({
                message: 'Unfollowed successfully',
                success: true,
                following: updatedUser.following // Return the updated following list
            });
        } else {
            // Follow logic
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ]);

            // Refetch the updated user data with populated fields
            const updatedUser = await User.findById(followKrneWala).populate('following', 'username profilePicture');
            return res.status(200).json({
                message: 'Followed successfully',
                success: true,
                following: updatedUser.following // Return the updated following list
            });
        }
    } catch (error) {
        console.error('Error in follow/unfollow logic:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

