"use client";
import React, { useState } from "react";
import { Spotlight } from "@/components/ui/spotlight-new";
import { faLightbulb, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import img from "../../assets/bg1.svg"; // Ensure this path is correct

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const cards = [
    { text: "Not able to find the right resources?", icon: faLightbulb },
    { text: "Facing issues?", icon: faLightbulb },
    { text: "Need Guidance?", icon: faLightbulb },
    { text: "Looking for Mentors?", icon: faLightbulb },
  ];

  return (
    <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight />
      <div
        className="relative w-full font-mono h-full"
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Heading */}
        <div className="relative z-10 text-white text-center text-2xl sm:text-4xl pt-10">
          <h2>Ask Your Query</h2>
        </div>

        {/* Search Bar */}
        <div className="relative z-10 flex items-center justify-center pt-20 sm:pt-32">
          <div className="relative w-full max-w-screen-lg">
            <input
              type="text"
              className="w-full pl-12 pr-16 py-3 sm:py-4 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder='Try "I want a roadmap for Data Science..."'
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {/* Search Button */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <a
                href="https://chatbot-last-bf47.onrender.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-28 sm:w-32 h-10 sm:h-12 bg-blue-500 text-white rounded-full"
              >
                <FontAwesomeIcon icon={faSearch} />
                <span className="pl-2 sm:pl-3">Search</span>
              </a>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="relative z-10 overflow-hidden mt-9 container max-w-screen-lg flex flex-wrap justify-center items-center gap-4 mx-auto">
          {cards.map((card, index) => (
            <a
              href="https://chatbot-last-bf47.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              className="w-full sm:w-auto min-w-[280px] sm:min-w-[400px] p-4 sm:p-5 px-6 bg-[#1e293b] text-white rounded-lg text-center shadow-lg flex items-center space-x-4 cursor-pointer"
            >
              <FontAwesomeIcon
                icon={card.icon}
                className="text-lg sm:text-xl text-yellow-300 rounded"
              />
              <span className="text-xs sm:text-sm md:text-base">
                {card.text}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
