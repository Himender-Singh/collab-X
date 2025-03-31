import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";
import { Reply } from "lucide-react";

const Comment = ({ comment, onReply, isReply = false }) => {
  if (!comment) {
    return (
      <div>
        Comments are only viewed at home page.
        <Link to={"/feed"} className="text-blue-500">
          Return back to feed page
        </Link>
      </div>
    );
  }

  return (
    <div className={`my-2 ${isReply ? 'ml-2' : ''}`}>
      <div className="flex gap-3 items-start">
        <Link to={`/profile/${comment.author?._id}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author?.profilePicture} />
            <AvatarFallback>
              {comment.author?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link 
              to={`/profile/${comment.author?._id}`} 
              className="font-bold text-sm hover:underline"
            >
              {comment.author?.username || 'Unknown'}
            </Link>
            <span className="font-normal text-gray-300 text-sm">
              {comment.text}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
            <span>{new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            <button 
              onClick={onReply} 
              className="flex items-center gap-1 hover:text-gray-300"
            >
              <Reply size={14} />
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;