import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "../ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "../ui/badge";
import { toast } from "react-toastify";
import { followingUpdate } from "@/redux/authSlice";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments || []);
  const dispatch = useDispatch();
  const [isFollowing, setIsFollowing] = useState(
    user?.following.includes(post.author?._id)
  );

  const followAndUnfollowHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/user/followorunfollow/${post.author._id}`,
        { userId: user._id }
      );
      setIsFollowing(!isFollowing); // Toggle follow state locally
      dispatch(followingUpdate(post.author._id)); // Update follow state in Redux
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error following/unfollowing:", error.response);
      toast.error(error.response.data.message);
    }
  };

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8080/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const commentHandler = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const newComment = res.data.comment;
        const updatedCommentData = [...comment, newComment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment. Please try again.");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!post || !post.author) return null;

  return (
    <div className="my-8 bg-gray-800 rounded-lg p-4 text-white w-full max-w-md mx-auto shadow-md transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between mb-2">
        <Link to={`/profile/${post?.author._id}`}>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={post.author?.profilePicture || "/default-profile.png"}
                alt="post_image"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold">
                {post.author?.username || "Unknown User"}
              </h1>
              {user?._id === post.author?._id && (
                <Badge variant="secondary">Author</Badge>
              )}
            </div>
          </div>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer hover:text-gray-400 transition-colors duration-200" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button variant="ghost" className="w-fit">
              Add to favorites
            </Button>
            {user._id === post.author._id && (
              <Button
                onClick={() => deletePostHandler(post._id)}
                variant="ghost"
                className="w-fit hover:bg-red-600 hover:text-white"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-lg my-2 w-full aspect-square object-cover"
        src={post.image}
        alt="post_img"
      />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              size={24}
              className="cursor-pointer text-red-600 transition-transform transform hover:scale-110"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              size={24}
              className="cursor-pointer hover:text-gray-600 transition-colors duration-200"
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600 transition-colors duration-200"
          />
          <Send className="cursor-pointer hover:text-gray-600 transition-colors duration-200" />
        </div>
        <Bookmark
          onClick={bookmarkHandler}
          className="cursor-pointer hover:text-gray-600 transition-colors duration-200"
        />
      </div>
      <span className="font-medium block mb-2">{postLike} likes</span>
      <p className="text-sm mb-2">
        <span className="font-medium">{post.author?.username}</span>{" "}
        {post.caption}
      </p>
      {comment.length > 0 &&  (
        <div className="comments-section">
          {comment.map((c, index) => (
            <p key={index} className="text-sm text-gray-400">
              <span className="font-medium">{c.author?.username}</span> {c.text}
            </p>
          ))}
        </div>
      )}
      <span
        onClick={() => {
          dispatch(setSelectedPost(post));
          setOpen(true);
        }}
        className="cursor-pointer text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200"
      >
        View all {comment.length} comments
      </span>
      <CommentDialog open={open} setOpen={setOpen} comments={comment} />
      <div className="flex flex-wrap items-center justify-between mt-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="flex-grow outline-none text-sm p-2 bg-gray-700 rounded-md"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#3BADF8] cursor-pointer font-semibold"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
