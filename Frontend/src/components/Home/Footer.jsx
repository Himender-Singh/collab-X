import React from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons"; // Import icons
import logo from "../../assets/logo.png";

const Footer = () => {
  const location = useLocation(); // Get the current location

  // Check if the current path is the home page
  const isHomePage = location.pathname === "/";

  if (!isHomePage) return null; // Return null to hide the footer if not on home page

  return (
    <div className="bg-[#080101] w-full font-poppins text-white shadow-md shadow-gray-800/10 z-50">
      <div className="container max-w-screen-xl mx-auto px-4 py-10 border-t-2 flex flex-col md:flex-row justify-between items-center">
        {/* Left - Logo */}
        <div className="w-10 sm:w-14 mb-4 md:mb-0">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>

        {/* Middle - Links */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 lg:space-x-8">
          <Link to="/feed" className="hover:text-blue-500">
            Feed
          </Link>
          <Link to="/about" className="hover:text-blue-500">
            About
          </Link>
          <Link to="/search" className="hover:text-blue-500">
            Mentorship
          </Link>
          <Link to="/mentors" className="hover:text-blue-500">
            Instructors
          </Link>
          <Link to="https://chatbot-last-bf47.onrender.com " target="_blank" className="hover:text-blue-500">
            ChatBot
          </Link>
          <Link to="https://chatbot-last-bf47.onrender.com " target="_blank" className="hover:text-blue-500">
            AI Roadmaps
          </Link>
        </div>

        {/* Right - Social Links and Contact */}
        <div className="mt-4 md:mt-0 flex space-x-4">
          <a
            href="https://www.linkedin.com/in/himender-singh-54ba88282/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500"
          >
            <FontAwesomeIcon icon={faLinkedin} size="lg" />
          </a>
          <a
            href="https://wa.me/yourwhatsapplink"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500"
          >
            <FontAwesomeIcon icon={faWhatsapp} size="lg" />
          </a>
          <a
            href="https://www.instagram.com/tanwer8191/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500"
          >
            <FontAwesomeIcon icon={faInstagram} size="lg" />
          </a>
          <p className="text-gray-300">Contact: himanshutawer34@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
