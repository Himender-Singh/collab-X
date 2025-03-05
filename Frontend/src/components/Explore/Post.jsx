import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
  Bookmark,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share,
} from "lucide-react";
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
import { server } from "@/main";
import Picker from "emoji-picker-react";
import { FaBookmark } from "react-icons/fa";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [postLike, setPostLike] = useState(post.likes.length);
  const [readmore, setReadMore] = useState(false);
  const [comment, setComment] = useState(post.comments || []);
  const dispatch = useDispatch();
  const [isFollowing, setIsFollowing] = useState(
    user?.following.includes(post.author?._id)
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [bookmark, setBookmark] = useState(
    (post.bookmarks || []).includes(user?._id) || false
  );
  const [pdfModalOpen, setPdfModalOpen] = useState(false); // State for PDF modal
  const [searchQuery, setSearchQuery] = useState(""); // Search functionality state

  const filteredPosts = posts.filter((p) =>
    p.caption.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Determine the file type based on the URL
  const getFileType = (url) => {
    if (url.match(/\.(jpeg|jpg|gif|png)$/i)) {
      return "image";
    } else if (url.match(/\.(mp4|mov|avi|mkv)$/i)) {
      return "video";
    } else if (url.includes("raw/upload")) {
      return "pdf";
    }
    return "unknown";
  };

  const fileType = getFileType(post.image);

  // Handle changes in the comment input field
  const changeEventHandler = (e) => {
    setText(e.target.value);
  };

  const followAndUnfollowHandler = async () => {
    try {
      const res = await axios.post(
        `${server}/user/followorunfollow/${post.author._id}`,
        { userId: user._id }
      );
      setIsFollowing(!isFollowing);
      dispatch(followingUpdate(post.author._id));
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error following/unfollowing:", error.response);
      toast.error(error.response.data.message);
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(`${server}/post/${post._id}/${action}`, {
        withCredentials: true,
      });
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
        // toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const commentHandler = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `${server}/post/${post._id}/comment`,
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
        // toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment. Please try again.");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`${server}/post/delete/${post?._id}`, {
        withCredentials: true,
      });
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
      const res = await axios.get(`${server}/post/${post?._id}/bookmark`, {
        withCredentials: true,
      });
      if (res.data.success) {
        // toast.success(res.data.message);
        const newBookmarkState = !bookmark;
        setBookmark(newBookmarkState);

        // Save to local storage
        localStorage.setItem(`bookmark-${post._id}`, newBookmarkState);

        // Update Redux state if needed
        const updatedPosts = posts.map((p) =>
          p._id === post._id
            ? { ...p, bookmarks: res.data.updatedBookmarks }
            : p
        );
        dispatch(setPosts(updatedPosts));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const savedBookmarkState = localStorage.getItem(`bookmark-${post._id}`);
    if (savedBookmarkState !== null) {
      setBookmark(JSON.parse(savedBookmarkState));
    }
  }, [post._id]);

  const sharePost = async () => {
    if (navigator.share) {
      const shareUrl = `${post.image}`; // Use post._id directly
      console.log("Sharing URL:", shareUrl); // Log the URL to check if it's correct
      try {
        await navigator.share({
          title: post.caption, // Use the post caption as the title
          text: `Check out this post!`, // Custom share text
          url: shareUrl, // Link to the specific post
        });
        toast.success("Post shared in progress!");
      } catch (error) {
        console.error("Error sharing post:", error);
        toast.error("Failed to share post.");
      }
    } else {
      toast.warning("Share feature is not supported in your browser.");
    }
  };

  // console.log(post,"post");

  const onEmojiClick = (event) => {
    // Append the selected emoji to the existing text only if it exists.
    const emoji = event.emoji || "";
    setText((prevText) => prevText + emoji);
    setShowEmojiPicker(false);
    console.log(emoji, "data ");
  };

  if (!post || !post.author) return null;

  return (
    <div>
      <div className="my-8 bg-gray-800 p-4 text-white w-full max-w-lg mx-auto shadow-md transition-all duration-300 ease-in-out">
        {/* Post Header */}

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

        {/* Post Media */}
        {fileType === "image" && (
          <img
            className="rounded-lg my-2 w-full aspect-square object-cover"
            src={post.image}
            alt="post_img"
          />
        )}
        {fileType === "video" && (
          <video
            className="rounded-lg my-2 w-full aspect-square object-cover"
            controls
          >
            <source src={post.image} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        {fileType === "pdf" && (
          <div className="flex flex-col gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <iframe
                  className="rounded-lg my-2 w-full h-96 cursor-pointer"
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                    post.image
                  )}&embedded=true`}
                  title="PDF Viewer"
                  onClick={() => setPdfModalOpen(true)}
                />
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[90vh]">
                <iframe
                  className="w-full h-full"
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                    post.image
                  )}&embedded=true`}
                  title="PDF Viewer"
                />
              </DialogContent>
            </Dialog>
            <a
              href={post.image}
              download
              className="text-blue-500 hover:underline text-center"
            >
              Download PDF
            </a>
          </div>
        )}

        {/* Post Actions */}
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
            <Share
              onClick={sharePost}
              className="cursor-pointer hover:text-gray-600 transition-colors duration-200"
            />
          </div>

          {bookmark ? (
            <FaBookmark
            onClick={bookmarkHandler}
            size={24}
            className="cursor-pointer hover:text-gray-600 transition-colors duration-200"
          />
          ) : (
            

            <Bookmark
              onClick={bookmarkHandler}
              size={24}
              className="cursor-pointer  transition-transform transform hover:scale-110"
            />
          )}
        </div>
        <span className="font-medium block mb-2">{postLike} likes</span>

        <p className="text-sm mb-2">
          <span className="font-medium">{post.author?.username}</span>{" "}
          {readmore
            ? post.caption.split("\n").map((line, index) => (
                <p key={index} className="mb-2">
                  {line.split(" ").map((word, idx) => (
                    <span
                      key={idx}
                      className={
                        word.startsWith(":") && word.endsWith(":")
                          ? "font-bold"
                          : ""
                      }
                    >
                      {word}{" "}
                    </span>
                  ))}
                </p>
              ))
            : `${post.caption.substring(0, 100)}...`}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setReadMore(!readmore)}
          >
            {readmore ? " Show less" : " Read more"}
          </span>
        </p>

        {/* Comments Section */}
        {comment.length > 0 && (
          <div className="comments-section">
            <p className="text-sm text-gray-400">
              <span className="font-medium">
                {comment[comment.length - 1]?.author?.username}
              </span>{" "}
              {comment[comment.length - 1]?.text}
            </p>
          </div>
        )}
        <span
          className="text-sm text-gray-400 cursor-pointer hover:underline"
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
        >
          View all {comment.length} comments
        </span>
        <Dialog open={open} onOpenChange={setOpen}>
          <CommentDialog open={open} setOpen={setOpen} comments={comment} />
        </Dialog>

        {/* Comment Input with Emoji Picker integrated */}
        <div className="mt-4 flex gap-2 relative">
          <button
            className="bg-gray-600 rounded-lg p-2"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            😊
          </button>
          {showEmojiPicker && (
            <div className="absolute z-10 bottom-10 right-0">
              <Picker onEmojiClick={onEmojiClick} />
            </div>
          )}
          <input
            className="flex-1 bg-gray-700 rounded-lg p-2 text-white placeholder-gray-400"
            type="text"
            placeholder="Write a comment..."
            value={text}
            onChange={changeEventHandler} // Fixed: Now correctly linked to the function
          />
          <Button
            onClick={commentHandler}
            disabled={!text.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Post;
