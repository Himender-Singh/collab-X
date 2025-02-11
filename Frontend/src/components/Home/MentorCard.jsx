import React from "react";
import img from "../../assets/a5.svg"; // Replace with the actual image path

const MentorCard = () => {
  return (
    <div className="w-full sm:w-[28rem] border border-gray-700 bg-[#060b20] shadow-lg rounded-lg p-6 md:p-8 space-y-4 relative overflow-hidden transition-transform transform hover:scale-105">
      {/* Mentor Info Row */}
      <div className="flex items-center space-x-4">
        {/* Mentor Image */}
        <img
          src="https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"
          alt="Arpit Bhushan Sharma"
          className="w-16 h-16 border rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h1 className="font-bold text-white text-lg md:text-xl">Arpit Bhushan Sharma</h1>
          <h2 className="text-gray-400 text-md md:text-lg">Career Counsellor</h2>
        </div>
      </div>

      {/* Ratings, Experience, and Sessions Row */}
      <div className="flex justify-between text-gray-400 text-sm md:text-base">
        <div className="flex flex-col items-center">
          <span className="text-yellow-400 text-lg">⭐ 4.9</span>
          <span className="text-xs md:text-sm">Ratings</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-white text-lg">3+ years</span>
          <span className="text-xs md:text-sm">Experience</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-white text-lg">100+</span>
          <span className="text-xs md:text-sm">Sessions</span>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
