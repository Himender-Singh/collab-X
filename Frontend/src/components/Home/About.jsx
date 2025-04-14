import React, { useState } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const About = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {/* Hero Section */}
      <Link to={'/'}>
        <FontAwesomeIcon icon={faArrowLeft} className="p-4 bg-green-400 font-bold" />
      </Link>
      <div className="bg-blue-700 py-16 px-4 text-white">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            At [Your Company Name], we’re committed to empowering individuals
            through innovative technology solutions. Explore how we help you
            shape your future, connect with like-minded people, and create your
            own network.
          </p>
        </div>
      </div>
      {/* Mission Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our mission is to provide individuals with personalized career
            roadmaps through AI technology, helping them navigate their
            professional paths based on their skills and aspirations.
          </p>
        </div>
        <div className="text-center max-w-2xl mx-auto text-gray-600 mt-6">
          <p>
            Whether you’re just starting your career journey, seeking guidance,
            or exploring new opportunities, our platform connects you with
            others who share similar goals. Our goal is to create a thriving
            community where you can grow together.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-10 px-4">
        <div className="container mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Our Values
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mt-4">
            Integrity, innovation, and inclusivity form the foundation of
            everything we do. We aim to build a platform that fosters meaningful
            connections, encourages collaboration, and promotes lifelong
            learning.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="max-w-sm bg-gray-100 rounded-lg p-6 text-center shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800">Integrity</h3>
            <p className="text-gray-600 mt-2">
              We prioritize transparency and ethical practices, ensuring trust
              in every interaction and collaboration.
            </p>
          </div>
          <div className="max-w-sm bg-gray-100 rounded-lg p-6 text-center shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800">Innovation</h3>
            <p className="text-gray-600 mt-2">
              Harnessing cutting-edge AI technology, we provide innovative
              career guidance and networking solutions.
            </p>
          </div>
          <div className="max-w-sm bg-gray-100 rounded-lg p-6 text-center shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800">Inclusivity</h3>
            <p className="text-gray-600 mt-2">
              Our platform welcomes everyone, ensuring that every individual can
              find their path and connect with others who share similar
              passions.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="bg-gray-50 py-10 px-4">
        <div className="container mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Key Features
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {/* Feature 1 */}
          <div className="max-w-sm bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Personalized AI Career Roadmaps
            </h3>
            <p className="text-gray-600 mt-2">
              Our AI-powered chatbot helps you design your career roadmap based
              on your skills, preferences, and aspirations, guiding you towards
              the most fulfilling professional path.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="max-w-sm bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Connect with Like-Minded People
            </h3>
            <p className="text-gray-600 mt-2">
              Our platform allows you to connect with others who share similar
              interests and career goals, creating valuable opportunities for
              collaboration and support.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="max-w-sm bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Integrated Social Media
            </h3>
            <p className="text-gray-600 mt-2">
              Stay connected with peers and mentors by linking your social media
              profiles and leveraging our built-in social media features to keep
              the conversation going.
            </p>
          </div>
          {/* Feature 4 */}
          <div className="max-w-sm bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Build Your Network
            </h3>
            <p className="text-gray-600 mt-2">
              Expand your professional network by building connections within
              our platform, with the ability to reach out to others and grow
              your career opportunities.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
