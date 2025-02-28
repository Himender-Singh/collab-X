import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faClipboardList,
  faCode,
  faArrowAltCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const truncateBio = (bio, maxLength = 70) => {
  return bio.length <= maxLength ? bio : bio.slice(0, maxLength) + "...";
};

const Card = ({
  content,
  author,
  role,
  experience,
  skills = [],
  userImage,
  userId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleBio = () => setIsExpanded(!isExpanded);
  const truncatedContent = content ? truncateBio(content) : "";

  return (
    <div className="bg-gradient-to-br from-[#131820] to-[#1b2330] text-white shadow-xl rounded-2xl p-6 md:p-8 mb-6 border border-gray-700 transition-transform transform hover:scale-105 duration-300">
      {/* Profile Info */}
      {author && (
        <Link to={`/profile/${userId}`} className="flex items-center mb-6">
          <img
            src={userImage || "https://via.placeholder.com/64"}
            alt={`${author}'s profile`}
            className="w-16 h-16 rounded-full border-4 border-red-500 shadow-md"
          />
          <div className="ml-4">
            <h2 className="text-lg font-bold">{author}</h2>
            <p className="text-gray-400 text-sm">@{author}</p>
            {role && <p className="text-red-400 font-medium text-sm">{role}</p>}
          </div>
        </Link>
      )}

      {/* Bio Section */}
      {content && (
        <>
          <p className="text-gray-300 mb-4">{isExpanded ? content : truncatedContent}</p>
          {content.length > 70 && (
            <button
              onClick={toggleBio}
              className="text-red-400 font-semibold hover:text-red-500 transition"
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>
          )}
        </>
      )}

      {/* Experience */}
      {experience && (
        <div className="mt-6">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUser} className="text-red-500 mr-2" />
            <h3 className="font-semibold text-gray-200">Experience:</h3>
          </div>
          <p className="text-gray-400">{experience}</p>
        </div>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faClipboardList} className="text-red-500 mr-2" />
            <h3 className="font-semibold text-gray-200">Skills:</h3>
          </div>
          <div className="flex flex-wrap mt-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2 shadow-lg transition hover:bg-red-700"
              >
                <FontAwesomeIcon icon={faCode} className="mr-1" />
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Call-To-Action Button */}
      {userId && (
        <div className="mt-6 flex flex-wrap">
          <Link to={`/profile/${userId}`} className="w-full sm:w-auto">
            <button className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold mr-2 mb-2 hover:bg-red-600 transition w-full sm:w-auto">
              Watch my profile <FontAwesomeIcon icon={faArrowAltCircleRight} />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Card;
