import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";
import Comment from "./Comment";
import { server } from "@/main";
import Picker from "emoji-picker-react";
import {
  FaThumbsUp,
  FaComment,
  FaEye,
  FaShareSquare,
  FaEllipsisH,
  FaFolder,
  FaHeart,
  FaBookmark,
} from "react-icons/fa";
import { Bookmark, Command, Folder, Heart, Share } from "lucide-react";

const CommentDialog = ({ open, setOpen, comments: initialComments }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts, user } = useSelector((store) => store.post);
  const [comments, setComments] = useState(initialComments || []);
  const [liked, setLiked] = useState(false);
  const [postLikes, setPostLikes] = useState(selectedPost?.likes?.length || 0);
  const [showComments, setShowComments] = useState(true);
  const dispatch = useDispatch();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const [bookmark, setBookmark] = useState(
    (selectedPost.bookmarks || []).includes(user?._id) || false
  );

  const changeEventHandler = (e) => {
    setText(e.target.value.trim() ? e.target.value : "");
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `${server}/post/${selectedPost._id}/bookmark`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        const newBookmarkState = !bookmark;
        setBookmark(newBookmarkState);

        // Update Redux state
        const updatedPosts = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, bookmarks: res.data.updatedBookmarks }
            : p
        );
        dispatch(setPosts(updatedPosts));
      }
    } catch (error) {
      console.error("Error bookmarking post:", error);
      toast.error("Failed to bookmark post.");
    }
  };

  const sendMessageHandler = async () => {
    if (!text.trim() || !selectedPost?._id) return;

    try {
      const res = await axios.post(
        `${server}/post/${selectedPost._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const newComment = res.data.comment;
        const updatedComments = [...comments, newComment];
        setComments(updatedComments);

        const updatedPosts = posts.map((post) =>
          post._id === selectedPost._id
            ? { ...post, comments: updatedComments }
            : post
        );
        dispatch(setPosts(updatedPosts));

        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment.");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `${server}/post/${selectedPost._id}/${action}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLikes - 1 : postLikes + 1;
        setPostLikes(updatedLikes);
        setLiked(!liked);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
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
      console.error("Error liking/disliking post:", error);
      toast.error("Failed to update like status.");
    }
  };

  const sharePost = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedPost.title,
          text: `Check out this post!`,
          url: `${window.location.origin}/post/${selectedPost._id}`,
        });
        toast.success("Post shared successfully!");
      } catch (error) {
        console.error("Error sharing post:", error);
        toast.error("Failed to share post.");
      }
    } else {
      toast.warning("Share feature is not supported in your browser.");
    }
  };

  const [pdfModalOpen, setPdfModalOpen] = useState(false);

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

  const fileType = getFileType(selectedPost.image);

  const onEmojiClick = (event) => {
    setText((prevText) => prevText + event.emoji);
    setShowEmojiPicker(false);
  };

  console.log("data", selectedPost);

  if (!selectedPost) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-7xl h-[42rem] border-none overflow-y-auto p-0 flex flex-col bg-gray-900 text-white">
        <div className="flex h-full flex-1">
          <div className="w-2/3 border-r border-gray-700 h-full overflow-hidden">
            {fileType === "image" && (
              <img
                className="w-full aspect-square h-full object-fill"
                src={selectedPost.image}
                alt="selectedPost_img"
              />
            )}
            {fileType === "video" && (
              <video
                className="w-full aspect-square h-full object-fill"
                controls
                autoPlay
              >
                <source src={selectedPost.image} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {fileType === "pdf" && (
              <div className="flex flex-col p-2 gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <iframe
                      className="my-2 w-full h-[35rem] cursor-pointer"
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                        selectedPost.image
                      )}&embedded=true`}
                      title="PDF Viewer"
                      onClick={() => setPdfModalOpen(true)}
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl h-[90vh]">
                    <iframe
                      className="w-[28rem] h-full"
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                        selectedPost.image
                      )}&embedded=true`}
                      title="PDF Viewer"
                    />
                  </DialogContent>
                </Dialog>
                <div className="flex justify-center items-center">
                  <a
                    href={selectedPost.image}
                    download
                    className="text-gray-50 rounded-lg p-2 bg-blue-600 hover:underline text-center"
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="w-[40%] flex flex-col justify-between">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex gap-3 items-center">
                <Link to={`/profile/${selectedPost.author?._id}`}>
                  <Avatar>
                    <AvatarImage src={selectedPost.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link
                    to={`/profile/${selectedPost.author?._id}`}
                    className="font-semibold text-sm text-gray-300"
                  >
                    {selectedPost.author?.username || "Unknown User"}
                  </Link>
                </div>
              </div>
              <div className="relative">
                <FaEllipsisH className="cursor-pointer text-gray-400" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {/* Caption as the first comment */}
              {selectedPost.caption && (
                <div className="my-2">
                  <div className="flex items-start gap-3">
                    <Link to={`/profile/${selectedPost.author?._id}`}>
                      <Avatar>
                        <AvatarImage
                          src={selectedPost.author?.profilePicture}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex flex-col">
                      <Link
                        to={`/profile/${selectedPost.author?._id}`}
                        className="font-semibold text-sm mb-4 w-20 border-b-2 border-b-green-600 text-gray-300"
                      >
                        {selectedPost.author?.username || "Unknown User"}
                      </Link>
                      <div className="text-gray-300 text-justify">
                        {selectedPost.caption.split("\n").map((line, index) => (
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
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Display Comments */}
              {showComments ? (
                comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id} className="my-2">
                      <Comment comment={comment} />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No comments yet.</p>
                )
              ) : (
                <div className="text-gray-300 text-justify">
                  {selectedPost.caption.split("\n").map((line, index) => (
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
                  ))}
                </div>
              )}
            </div>
            <div className="border-t w-full border-gray-700 pt-4">
              <div className="flex gap-10 text-xl p-4 text-gray-50">
                <button
                  onClick={likeOrDislikeHandler}
                  className="flex items-center gap-2 text-gray-50"
                >
                  <Heart className={liked ? "text-red-500" : "text-gray-50"} />
                </button>
                <button
                  onClick={() => setShowComments(true)}
                  className="flex items-center gap-2 text-gray-50"
                >
                  <Command />
                </button>

                <button
                  onClick={sharePost}
                  className="flex items-center gap-2 text-gray-50"
                >
                  <Share />
                </button>
                {bookmark ? (
                  <FaBookmark
                    onClick={bookmarkHandler}
                    size={24}
                    className="cursor-pointer hover:text-gray-600 transition-colors duration-200 ml-auto"
                  />
                ) : (
                  <Bookmark
                    onClick={bookmarkHandler}
                    size={24}
                    className="cursor-pointer transition-transform transform hover:scale-110 ml-auto"
                  />
                )}
              </div>
              <div>
                {postLikes && (
                  <div className="text-gray-50 p-4 text-start">
                    {postLikes} {postLikes === 1 ? "like" : "likes"}
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center mt-4 gap-2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={text}
                    onChange={changeEventHandler}
                    placeholder="Add a comment..."
                    className="w-full outline-none text-sm border-b border-gray-600 p-2 bg-transparent text-white"
                  />
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-300"
                  >
                    😀
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute right-0 bottom-10 z-10">
                      <Picker onEmojiClick={onEmojiClick} />
                    </div>
                  )}
                </div>
                <button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  className="text-blue-500 font-bold hover:text-blue-600"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
