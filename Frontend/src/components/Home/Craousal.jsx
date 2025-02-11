import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion, faExclamationCircle, faLifeRing, faWrench, faLightbulb, faHandsHelping } from "@fortawesome/free-solid-svg-icons";

const Craousal = () => {
  const cards = [
    { text: "Not able to find the right resources?", icon: faQuestion },
    { text: "Not able to connect with like-minded Peers?", icon: faExclamationCircle },
    { text: "Not able to find the right resources?", icon: faLightbulb },
    { text: "Facing issues?", icon:  faLifeRing },
    { text: "Need Guidance?", icon: faWrench },
    { text: "Looking for Mentors?", icon: faExclamationCircle },
  ];
  const card2 = [
    {text:"Frustrated because of irrelevant content on Social Media platforms.",icon: faQuestion},
    { text: "Lack of Replies from Influencers/ Mentors", icon: faHandsHelping },
    { text: "Need Guidance?", icon: faLifeRing },
    { text: "Lack of Expert Advice?", icon: faWrench },
    { text: " Need some help?", icon: faLightbulb },
    { text: "Looking for AI Guidance?", icon: faHandsHelping },
  ]

  // Variants for left-to-right animation with staggered children
  const leftToRightVariants = {
    animate: {
      x: ["0%", "-100%"], // Move from left to right
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 10, // Time to move across the entire width
          ease: "linear",
        },
        staggerChildren: 1, // Add a delay for the cards in the first row
      },
    },
  };

  // Variants for right-to-left animation with staggered children
  const rightToLeftVariants = {
    animate: {
      x: ["0%", "100%"], // Move from right to left
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear",
        },
        staggerChildren: 1, // Add a delay for the cards in the second row
      },
    },
  };

  return (
    <div className="w-full font-mono h-auto py-20 text-white">
      {/* Heading */}
      <div className="container max-w-screen-lg mx-auto flex justify-center items-center mb-6">
        <h1 className="text-2xl text-center lg:text-4xl mt-6">Do you face any of these problems?</h1>
      </div>

      {/* First Row (Left to Right Animation) */}
      <div className="overflow-hidden container mx-auto">
        <motion.div
          className="flex space-x-8"
          variants={leftToRightVariants}
          animate="animate"
        >
          {[...cards, ...cards].map((card, index) => (
            <motion.div
              key={index}
              className="min-w-[400px] p-5 bg-[#1e293b] rounded-lg text-center shadow-lg flex items-center space-x-4"
            >
              <FontAwesomeIcon icon={card.icon} className="text-xl rounded bg-gray-700 p-4" />
              <span>{card.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Second Row (Right to Left Animation) */}
      <div className="overflow-hidden mt-9 container mx-auto">
        <motion.div
          className="flex space-x-8"
          variants={leftToRightVariants}
          animate="animate"
        >
          {[...card2, ...card2].map((card, index) => (
            <motion.div
              key={index}
              className="min-w-[400px] p-5 bg-[#1e293b] rounded-lg text-center shadow-lg flex items-center space-x-4"
            >
              <FontAwesomeIcon icon={card.icon} className="text-xl rounded bg-gray-700 p-4" />
              <span>{card.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Craousal;
