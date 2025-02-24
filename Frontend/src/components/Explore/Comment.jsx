import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";

const Comment = ({ comment }) => {
  if (!comment || !comment.author) {
    return (
      <div>
        comments are only viewed at home page.
        <Link to={"/feed"} className="text-blue-500">
          {" "}
          Return back to feed page{" "}
        </Link>
      </div>
    );
  }
  return (
    <div className="my-2">
      <div className="flex gap-3 items-center">
        <Avatar>
          <AvatarImage src={comment?.author?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className="font-bold text-sm">
          {comment?.author.username}
          <span className="font-normal pl-1">{comment?.text}</span>
        </h1>
      </div>
    </div>
  );
};

export default Comment;
