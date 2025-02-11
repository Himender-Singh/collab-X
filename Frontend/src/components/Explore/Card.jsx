import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faStar,
  faComments,
  faClipboardList,
  faCode,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

// Default buttons definition
const defaultButtons = [
  { label: "Request One Time Mentorship", price: "" },
  { label: "Request Full Time Mentorship", price: "" },
];

const truncateBio = (bio, maxLength = 70) => {
  if (bio.length <= maxLength) return bio;
  return bio.slice(0, maxLength) + "...";
};

const Card = ({
  content = "User does not added bio yet.", // Default value
  author = "Default Author", // Default value
  role = "Default role", // Default value
  experience = "0 years of experience", // Default value
  sessions = "0", // Default value
  skills = [], // Default to an empty array if not provided
  buttons = defaultButtons, // Default to predefined buttons if none are provided
  userImage = "https://via.placeholder.com/64", // Default image
  userId = "",
}) => {
  // State for expanding and collapsing the bio
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle between full and truncated bio
  const toggleBio = () => {
    setIsExpanded(!isExpanded);
  };

  // Truncated content for initial display
  const truncatedContent = truncateBio(content);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 mb-4">
      <Link to={`/profile/${userId}`}>
        <div className="flex items-center mb-4">
          <img
            src={userImage}
            alt={`${author}'s profile`}
            className="w-16 h-16 rounded-full mr-4 border-2 border-blue-500"
          />
          <div>
            <h2 className="text-lg font-semibold">{author}</h2>
            <p className="text-gray-600">@{author}</p>
            <p className="text-gray-500 text-sm">{role}</p>
          </div>
        </div>
      </Link>

      <p className="text-gray-700 mb-4">
        {isExpanded ? content : truncatedContent}
      </p>

      {/* Show more / Show less button */}
      <button
        onClick={toggleBio}
        className="text-blue-500 font-semibold hover:underline"
      >
        {isExpanded ? "Show Less" : "Show More"}
      </button>

      <div className="mt-4">
        <div className="flex items-center mb-2">
          <FontAwesomeIcon icon={faUser} className="text-blue-500 mr-2" />
          <h3 className="font-semibold">Experience:</h3>
        </div>
        <p className="text-gray-700">{experience}</p>

        <div className="flex items-center mt-4">
          <div className="flex items-center mr-8">
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-2" />
            <span className="font-semibold">Ratings: 4⭐</span>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faComments} className="text-blue-500 mr-2" />
            <span className="font-semibold">Sessions: {sessions}</span>
          </div>
        </div>

        <div className="flex items-center mb-2 mt-4">
          <FontAwesomeIcon
            icon={faClipboardList}
            className="text-blue-500 mr-2"
          />
          <h3 className="font-semibold">Skills:</h3>
        </div>
        <div className="flex flex-wrap mt-2">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <button
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm mr-2 mb-2"
              >
                <FontAwesomeIcon icon={faCode} className="mr-1" />
                {skill}
              </button>
            ))
          ) : (
            <p className="text-gray-500">No skills listed</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap">
        <Link to={`/profile/${userId}`}>
          {buttons.map(({ label, price }, index) => (
            <button
              key={index}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 mb-2 hover:bg-blue-600 transition w-full sm:w-auto"
            >
              {label} <span className="font-bold">Free</span> {price}
            </button>
          ))}
        </Link>
      </div>
    </div>
  );
};

export default Card;
