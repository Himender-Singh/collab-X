import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUsers,
  faCodeBranch,
  faLaptopCode,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import useGetSuggestedUser from "@/hooks/useGetSuggestedUser";
import Card from "./Card";
import img from "../../assets/bg1.svg";
import { Link } from "react-router-dom";

const Search = () => {
  const { suggestedUsers } = useGetSuggestedUser() || { suggestedUsers: [] };
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id;
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredUsers = suggestedUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full min-h-screen text-white">

      {/* search bar */}
      <div className="flex items-center justify-center m-10">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            className="w-full pl-12 pr-16 py-3 rounded-full bg-[#1b1f2a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Search for a peer..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <button className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full">
              <FontAwesomeIcon icon={faSearch} />
              <span className="pl-2">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto pt-12 px-4">
        {/* User Cards Section */}
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Card
              key={user._id}
              title={user.username}
              content={user.bio}
              author={user.username}
              role={user.role}
              experience={`${user.experience} years`}
              skills={user.skills}
              userImage={
                user.profilePicture || "https://via.placeholder.com/64"
              }
              userId={user._id}
            />
          ))
        ) : (
          <p className="text-gray-400 text-lg col-span-full text-center">
            No matching peers found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;
