import React from "react";
import { Link } from "react-router-dom";

const Card = ({ user, isFollowing }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow h-full">
      <div className="flex items-center mb-4">
        <img 
          src={user.profilePicture || "https://via.placeholder.com/150"} 
          alt={user.username}
          className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
        />
        <div className="ml-4">
          <h3 className="text-xl font-semibold text-white">{user.username}</h3>
          <p className="text-gray-400 text-sm">{user.role || "Developer"}</p>
        </div>
      </div>
      
      <p className="text-gray-300 mb-4">
        {user.bio || "No bio available"}
      </p>
      
      <div className="mb-4">
        <p className="text-gray-400 text-sm mb-1">Experience:</p>
        <p className="text-white">
          {user.experience ? `${user.experience} years` : "Not specified"}
        </p>
      </div>
      
      {user.skills?.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-1">Skills:</p>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-gray-700 text-white text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <Link 
        to={`/profile/${user._id}`}
        className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        View Profile
      </Link>
    </div>
  );
};

export default Card;