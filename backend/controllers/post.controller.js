import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const file = req.file; // This can be an image, PDF, or video
    const authorId = req.id;

    let cloudResponse = null; // To store the uploaded file URL

    if (file) {
      if (file.mimetype.startsWith("image")) {
        // Handle image upload
        try {
          const optimizedImageBuffer = await sharp(file.buffer)
            .resize({ width: 800, height: 800, fit: "inside" })
            .toFormat("jpeg", { quality: 80 })
            .toBuffer();

          const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
            "base64"
          )}`;
          cloudResponse = await cloudinary.uploader.upload(fileUri, {
            resource_type: "image",
          });
        } catch (error) {
          console.error("Error processing image:", error);
          return res.status(400).json({ message: "Invalid image file" });
        }
      } else if (file.mimetype.startsWith("video")) {
        // Handle video upload
        const fileUri = `data:${file.mimetype};base64,${file.buffer.toString(
          "base64"
        )}`;
        cloudResponse = await cloudinary.uploader.upload(fileUri, {
          resource_type: "video",
        });
      } else if (file.mimetype === "application/pdf") {
        // Handle PDF upload
        const fileUri = `data:application/pdf;base64,${file.buffer.toString(
          "base64"
        )}`;
        cloudResponse = await cloudinary.uploader.upload(fileUri, {
          resource_type: "raw",
        });
      } else {
        return res.status(400).json({ message: "Unsupported file type" });
      }
    }

    // Create the post
    const post = await Post.create({
      caption,
      image: cloudResponse ? cloudResponse.secure_url : null, // Store file URL only if uploaded
      author: authorId,
    });

    // Update the user's posts
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New post added",
      post,
      success: true,
    });
  } catch (error) {
    console.error("Error in addNewPost:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};


export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    console.log(`Fetching posts for user: ${authorId}`); // Debug log
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } }, // Ensure comments are sorted
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log("Error fetching user posts:", error); // Log error
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    // like logic started
    await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
    await post.save();

    // implement socket io for real time notification
    const user = await User.findById(likeKrneWalaUserKiId).select(
      "username profilePicture"
    );

    const postOwnerId = post.author.toString();
    if (postOwnerId !== likeKrneWalaUserKiId) {
      // emit a notification event
      const notification = {
        type: "like",
        userId: likeKrneWalaUserKiId,
        userDetails: user,
        postId,
        message: "Your post was liked",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    return res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {}
};
export const dislikePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    // like logic started
    await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
    await post.save();

    // implement socket io for real time notification
    const user = await User.findById(likeKrneWalaUserKiId).select(
      "username profilePicture"
    );
    const postOwnerId = post.author.toString();
    if (postOwnerId !== likeKrneWalaUserKiId) {
      // emit a notification event
      const notification = {
        type: "dislike",
        userId: likeKrneWalaUserKiId,
        userDetails: user,
        postId,
        message: "Your post was liked",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {}
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentKrneWalaUserKiId = req.id;

    const { text } = req.body;

    const post = await Post.findById(postId);

    if (!text)
      return res
        .status(400)
        .json({ message: "text is required", success: false });

    const comment = await Comment.create({
      text,
      author: commentKrneWalaUserKiId,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment Added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const addReplyToComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required", success: false });
    }

    // Create the reply
    const reply = await Comment.create({
      text,
      author: userId,
      post: postId,
      parentComment: commentId
    });

    // Add the reply to the parent comment's replies array
    await Comment.findByIdAndUpdate(commentId, {
      $push: { replies: reply._id }
    });

    // Populate all necessary fields
    const populatedReply = await Comment.findById(reply._id)
      .populate({
        path: "author",
        select: "username profilePicture"
      })
      .populate({
        path: "parentComment",
        select: "text author"
      });

    return res.status(201).json({
      message: "Reply added successfully",
      reply: populatedReply,
      success: true
    });

  } catch (error) {
    console.error("Error in addReplyToComment:", error);
    return res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

// Update getRepliesForComment to better handle population
export const getRepliesForComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const replies = await Comment.find({ parentComment: commentId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture"
      })
      .populate({
        path: "replies",
        populate: {
          path: "author",
          select: "username profilePicture"
        }
      });

    return res.status(200).json({
      success: true,
      replies
    });

  } catch (error) {
    console.error("Error in getRepliesForComment:", error);
    return res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

// Update getCommentsOfPost to include nested replies
export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Get top-level comments with their replies populated
    const comments = await Comment.find({ 
      post: postId,
      parentComment: { $exists: false }
    })
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      select: "username profilePicture"
    })
    .populate({
      path: "replies",
      populate: [
        {
          path: "author",
          select: "username profilePicture"
        },
        {
          path: "replies",
          populate: {
            path: "author",
            select: "username profilePicture"
          }
        }
      ]
    });

    if (!comments || comments.length === 0) {
      return res.status(404).json({ 
        message: "No comments found for this post", 
        success: false 
      });
    }

    return res.status(200).json({ 
      success: true, 
      comments 
    });

  } catch (error) {
    console.error("Error in getCommentsOfPost:", error);
    return res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    // check if the logged-in user is the owner of the post
    if (post.author.toString() !== authorId)
      return res.status(403).json({ message: "Unauthorized" });

    // delete post
    await Post.findByIdAndDelete(postId);

    // remove the post id from the user's post
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    // delete associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    console.log(error);
  }
};
export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      // already bookmarked -> remove from the bookmark
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({
          type: "unsaved",
          message: "Post removed from bookmark",
          success: true,
        });
    } else {
      // bookmark krna pdega
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({ type: "saved", message: "Post bookmarked", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
