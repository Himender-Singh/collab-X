import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  FiSearch, 
  FiUsers, 
  FiCode, 
  FiUser,
  FiUserCheck
} from "react-icons/fi";
import { RiUserFollowFill } from "react-icons/ri";
import useGetSuggestedUser from "@/hooks/useGetSuggestedUser";
import Card from "./Card";
import { Link } from "react-router-dom";

const Search = () => {
  const { suggestedUsers } = useGetSuggestedUser() || { suggestedUsers: [] };
  const { user: currentUser } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("username");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);

  useEffect(() => {
    const skills = new Set();
    suggestedUsers.forEach(user => {
      if (user.skills) {
        user.skills.forEach(skill => skills.add(skill));
      }
    });
    setAvailableSkills([...skills]);
  }, [suggestedUsers]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  const filteredUsers = suggestedUsers.filter(user => {
    if (user._id === currentUser?._id) return false;
    
    if (searchBy === "username" && searchTerm) {
      return user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    if (selectedSkills.length > 0) {
      return selectedSkills.every(skill => 
        user.skills?.includes(skill)
      );
    }
    
    return true;
  });

  const isFollowing = (userId) => {
    return currentUser?.following?.includes(userId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-3">
          Find Your Coding Peers
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Connect with developers who share your interests and skills
        </p>
      </div>

      <div className="max-w-5xl mx-auto bg-gray-800 rounded-xl p-6 shadow-lg mb-10">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex rounded-lg gap-4 bg-gray-700 p-1">
            <button
              onClick={() => setSearchBy("username")}
              className={`flex items-center px-4 py-2 rounded-md transition-all ${
                searchBy === "username" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-400 hover:bg-gray-600"
              }`}
            >
              <FiUsers className="mr-2" />
              By Username
            </button>
            <button
              onClick={() => setSearchBy("skills")}
              className={`flex items-center px-4 py-2 rounded-md transition-all ${
                searchBy === "skills" 
                  ? "bg-purple-600 text-white" 
                  : "text-gray-400 hover:bg-gray-600"
              }`}
            >
              <FiCode className="mr-2" />
              By Skills
            </button>
          </div>

          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-500" />
            </div>
            <input
              type="text"
              className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                searchBy === "username" ? "focus:ring-blue-500" : "focus:ring-purple-500"
              }`}
              placeholder={
                searchBy === "username" 
                  ? "Search by username..." 
                  : "Type to filter skills..."
              }
              value={searchTerm}
              onChange={handleSearchChange}
              disabled={searchBy === "skills" && selectedSkills.length > 0}
            />
          </div>
        </div>

        {searchBy === "skills" && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Filter by skills:</h3>
            <div className="flex flex-wrap gap-2">
              {availableSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center transition-all ${
                    selectedSkills.includes(skill)
                      ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {skill}
                  {selectedSkills.includes(skill) && (
                    <span className="ml-1 text-xs">✕</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredUsers.map(user => (
            <div key={user._id} className="relative">
              {isFollowing(user._id) && (
                <div className="absolute -top-3 -right-3 z-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-lg">
                  <RiUserFollowFill className="mr-1" />
                  Following
                </div>
              )}
              <Card
                user={user}  // Pass the entire user object to Card
                isFollowing={isFollowing(user._id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-xl">
            <FiUser className="mx-auto text-5xl text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              No matching peers found
            </h3>
            <p className="text-gray-500">
              {searchBy === "username"
                ? "Try searching with a different username"
                : "Try selecting different skills or clearing your filters"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;