import React from "react";
import MentorCard from "./MentorCard"; // Ensure the path is correct
import img from "../../assets/a9.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Mentors = () => {
  return (
    <div className="font-mono">
      <div className="container max-w-screen-xl mx-auto p-6 md:p-10 flex flex-col items-center justify-center">
        <div className="text-center p-4 mb-4">
          <h2 className="text-3xl md:text-4xl text-[#FCE356] font-medium">
            Meet Our Inspirational Mentors
          </h2>
          <p className="text-gray-400 mt-4 text-sm md:text-md">
            Discover the Mentors who are ready to guide, inspire, and empower
            you. Get to know our accomplished experts and find the perfect
            Mentors to help you reach your goals.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Iterating MentorCard 5 times */}
          {Array.from({ length: 5 }, (_, index) => (
            <MentorCard key={index} />
          ))}
          {/* View All Mentors Card with Background Image and Blur Effect */}
          <div
            className="relative w-full md:w-[28rem] h-[15rem] bg-cover bg-center rounded-lg flex items-center justify-center text-center cursor-pointer transition duration-200"
            style={{ backgroundImage: `url(${img})` }}
          >
            <div className="absolute inset-0 bg-blue-600 bg-opacity-70 rounded-lg flex items-center justify-center">
              <h2 className="text-lg md:text-xl bg-black hover:bg-white hover:text-black text-white font-semibold p-4 rounded-lg shadow-md flex items-center">
                <Link to={"/mentors"}>View All Mentors</Link>
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentors;
