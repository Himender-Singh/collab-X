import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaImage, FaLightbulb, FaEdit } from "react-icons/fa"; // Icons for Media, Give Advice, Write Articles
import { Badge } from "../ui/badge";
import Create from "./Create";

const PostCreate = () => {
  const { user } = useSelector((store) => store.auth);
  const [openCreateModal, setOpenCreateModal] = useState(false); // State to control modal visibility

  // Function to handle opening the Create modal
  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  return (
    <>
      <div className="bg-[#1C1C1C] p-4 mt-14 text-white w-full max-w-xl rounded-xl mx-auto shadow-md transition-all duration-300 ease-in-out">
        {/* User Profile Section */}
        <Link to={`/profile/${user._id}`}>
          <div className="flex items-center space-x-3">
            <img
              src={user.profilePicture}
              alt="User"
              className="w-20 h-14 rounded-full"
            />
            <div>
              <div className="flex gap-2">
                <h2 className="text-lg font-semibold">{user.username}</h2>
                <Badge color="blue" className="text-xs capitalize bg-white hover:bg-yellow-500 hover:text-white text-black">
                  {user.role}
                </Badge>
              </div>
              <span className="text-xs font-semibold text-gray-400">
                {user.bio}
              </span>
            </div>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="mt-4" onClick={handleOpenCreateModal}>
          <input
            type="text"
            placeholder="Start sharing a post..."
            className="w-full px-4 py-2 bg-[#2C2C2C] text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            readOnly // Make the input field read-only to prevent typing
          />
        </div>

        {/* Icons Section */}
        <div className="mt-4 flex justify-between space-x-6">
          <div
            className="flex flex-row items-center cursor-pointer p-2 hover:text-gray-500 hover:border-b-2 hover:border-blue-500 transition-all"
            onClick={handleOpenCreateModal}
          >
            <FaImage className="w-6 h-6" />
            <span className="text-sm ml-2">Media</span>
          </div>
          <div
            className="flex flex-row items-center cursor-pointer p-2 hover:text-gray-500 hover:border-b-2 hover:border-blue-500 transition-all"
            onClick={handleOpenCreateModal}
          >
            <FaLightbulb className="w-6 h-6" />
            <span className="text-sm ml-2">Give Advice</span>
          </div>
          <div
            className="flex flex-row items-center cursor-pointer p-2 hover:text-gray-500 hover:border-b-2 hover:border-blue-500 transition-all"
            onClick={handleOpenCreateModal}
          >
            <FaEdit className="w-6 h-6" />
            <span className="text-sm ml-2">Write Articles</span>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <Create open={openCreateModal} setOpen={setOpenCreateModal} />
    </>
  );
};

export default PostCreate;