import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";
import Comment from "./Comment";
import { server } from "@/main";
import Picker from "emoji-picker-react";
import { FaThumbsUp, FaBookmark, FaShareSquare } from "react-icons/fa"; // Importing react-icons

const CommentDialog = ({ open, setOpen, comments: initialComments }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts, user } = useSelector((store) => store.post);
  const [comments, setComments] = useState(initialComments || []);
  const [liked, setLiked] = useState(false);
  const [postLikes, setPostLikes] = useState(selectedPost?.likes?.length || 0);
  const dispatch = useDispatch();
  const prevComments = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (JSON.stringify(prevComments.current) !== JSON.stringify(initialComments)) {
      prevComments.current = initialComments; // Store last known comments
      setComments(initialComments || []);
    }
  }, [initialComments]);

  const changeEventHandler = (e) => {
    setText(e.target.value.trim() ? e.target.value : "");
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
      const res = await axios.get(`${server}/post/${selectedPost._id}/${action}`, {
        withCredentials: true,
      });
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

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(`${server}/post/${selectedPost._id}/bookmark`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error bookmarking post:", error);
      toast.error("Failed to bookmark post.");
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

  const onEmojiClick = (event, emojiObject) => {
    setText((prevText) => prevText + event.emoji);
    setShowEmojiPicker(false);
  };

  if (!selectedPost) {
    return null; // Don't render if no post is selected
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto p-0 flex flex-col">
        <div className="flex flex-1">
          <div className="w-1/2 max-h-[60vh] overflow-hidden">
            <img
              src={selectedPost.image}
              alt="post_img"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
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
                    className="font-semibold text-xs"
                  >
                    {selectedPost.author?.username || "Unknown User"}
                  </Link>
                </div>
              </div>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faEllipsisH}
                  className="cursor-pointer"
                />
              </div>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-72 p-2">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="my-1">
                    <Comment comment={comment} />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No comments yet.</p>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={text}
                    onChange={changeEventHandler}
                    placeholder="Add a comment..."
                    className="w-full outline-none border text-sm border-gray-300 p-2 rounded"
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
                <Button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  variant="outline"
                >
                  Send
                </Button>
              </div>
            </div>
            <div className="flex justify-between p-4">
              <Button onClick={likeOrDislikeHandler} variant="outline">
                <FaThumbsUp /> {postLikes}
              </Button>
              <Button onClick={bookmarkHandler} variant="outline">
                <FaBookmark />
              </Button>
              <Button onClick={sharePost} variant="outline">
                <FaShareSquare />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
