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
      <div className="flex items-center justify-center mt-10">
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

      <div className="flex flex-col md:flex-row justify-between font-mono my-20 mx-6 md:mx-12">
  {/* Left Section */}
  <div className="w-full md:w-2/3 text-center md:text-left">
    <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white">
      Find Your Coding Partner!
    </h2>
    <p className="text-gray-300 w-full md:w-[42rem] mt-3 text-lg md:text-2xl">
      Connect with like-minded peers, collaborate on projects, and enhance your skills with real-time coding and discussions.
    </p>
    <div className="mt-6 md:mt-8">
      <Link to="/code-editor">
        <button className="bg-blue-100 shadow-green-400 duration-1000 text-black text-lg md:text-2xl font-semibold rounded-full shadow-lg transition-shadow p-3 md:p-4 hover:shadow-blue-400">
          Let's Code Together!
        </button>
      </Link>
    </div>
  </div>

  {/* Features Section */}
  <div className="bg-gradient-to-b duration-1000 mt-8 md:mt-0 md:w-96 shadow-2xl shadow-blue-300 hover:shadow-green-800 from-[#131820] to-[#1b2330] rounded-2xl p-6 md:p-8 w-full text-gray-200 border border-gray-700">
    <h3 className="text-lg md:text-xl font-bold text-white text-center mb-4 tracking-wide">
      🚀 Why <span className="text-red-500">CollabX?</span>
    </h3>
    <ul className="mt-4 space-y-4">
      {[
        { icon: faUsers, text: "Work with skilled peers & learn together.", color: "bg-red-600" },
        { icon: faCodeBranch, text: "Build real-world projects & improve coding.", color: "bg-blue-500" },
        { icon: faLaptopCode, text: "Participate in hackathons & challenges.", color: "bg-yellow-500" },
        { icon: faLightbulb, text: "Gain mentorship & networking opportunities.", color: "bg-green-500" },
      ].map(({ icon, text, color }, index) => (
        <li key={index} className="flex items-center group">
          <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center ${color} rounded-full text-white shadow-md transition-transform transform group-hover:scale-110`}>
            <FontAwesomeIcon icon={icon} className="text-lg" />
          </div>
          <span className="ml-4 text-gray-300 group-hover:text-white transition-colors duration-300">
            {text}
          </span>
        </li>
      ))}
    </ul>
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
