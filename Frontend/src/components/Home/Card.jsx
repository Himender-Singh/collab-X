import React from "react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const Card = ({ img, title, desc1, desc2, desc3, main, index }) => {
  return (
    <div
      className={`flex flex-col md:flex-row font-thin h-full w-full items-center my-12 md:my-24 ${
        index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      {/* Image Section with Glowing Effect */}
      <div className="w-full md:w-1/2 relative mb-4 md:mb-0">
        {/* Glowing Effect behind the image */}
        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-400 to-pink-500 opacity-70 blur-3xl shadow-2xl transform scale-105"></div>

        <img
          src={img}
          alt={title}
          className="object-cover bg-gradient-to-r from-black to-red-950 border border-violet-300 shadow-emerald-400 shadow-lg h-[20rem] md:h-[30rem] transition-transform duration-300 transform hover:scale-105 w-full rounded-md relative z-10"
        />
      </div>

      {/* Content Section */}
      <div className="w-full md:w-1/2 m-4 px-4">
        <h1 className="font-bold text-white text-3xl md:text-4xl mb-4">{title}</h1>
        <p className="text-base md:text-lg my-3 font-semibold text-gray-300 leading-6">
          {desc1}
        </p>
        <p className="text-base md:text-lg my-3 font-semibold text-gray-300 leading-6">
          {desc2}
        </p>
        <p className="text-base md:text-lg my-3 font-semibold text-gray-300 leading-6">
          {desc3}
        </p>

        {/* Main Description Section */}
        <div className="w-full text-white flex flex-col h-60 rounded-lg p-4 border border-gray-700 bg-gray-800 shadow-lg">
          <p className="text-base md:text-lg my-5 font-semibold text-gray-400 leading-6">
            {main}
          </p>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="h-8" />
              <span className="text-white ml-2 font-bold text-lg">CollabX</span>
            </div>
            <Link to="/about" className="hover:text-blue-500">
              <span className="text-white font-semibold px-0 md:px-7 py-2 md:py-3 text-md rounded-full md:bg-gradient-to-l from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 transition-all duration-300">
                Explore now!
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
