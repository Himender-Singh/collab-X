import React from "react";
import img1 from "../../assets/w4.png";
import img2 from "../../assets/w2.png";
import img3 from "../../assets/w1.png";
import img4 from "../../assets/image.png";
import Card from "./Card";

const Feature = () => {
  const Data = [
    {
      img: img2,
      title: "Mock Interview System 🗣️",
      desc1: "Simulates real-world technical and behavioral interviews.",
      desc2:
        "Provides instant feedback to help users improve their performance.",
      desc3:
        "Prepares students and professionals for job interviews at top tech companies.",
      main: "It provides an immersive environment where students can practice technical and behavioral interview questions. Receive valuable feedback on your performance.",
    },
    
    {
      img: img3,
      title: "Use Your Favourite Tools to Code. No Limits. 👥",
      desc1:
        "The built-in code editor allows users to write, compile, and execute code in multiple programming languages.",
      desc2:
        "Enables pair programming, where two users can work on the same code in real-time.",
      desc3: "Supports C, C++, Java, Python, and other programming languages.",
      main: "Our built-in code editor provides seamless support for multiple programming languages, making it a versatile tool for coders of all levels.",
    },
    {
      img: img1,
      title: "Peer Matching System 🤖",
      desc1:
        "Connects individuals based on skills or complementary needs (e.g., frontend with backend).",
      desc2: "Encourages collaboration, knowledge-sharing, and teamwork.",
      desc3:
        "A supportive space for learning, networking, and professional growth.",
      main: "Our intelligent peer-matching system connects individuals based on their skills or complementary needs, such as pairing a frontend developer with a backend specialist.",
    },
    {
      img: img4,
      title: "Share coding resources, projects, and ideas. 👥",
      desc1:
        "Acts as a discussion forum or social hub where users can: Ask and answer technical questions.",
      desc2:
        "Creates a supportive environment where beginners and experts can learn from each other.",
      desc3:
        "Increases engagement and motivation through challenges and discussions.",
      main: "Helps users stay updated on the latest industry trends.Participate in coding challenges or hackathons.",
    },
  ];

  return (
    <div className="relative font-poppins font-medium">
      {/* Circular Neon Effect */}

      <div className="container max-w-screen-xl mx-auto p-10 flex flex-col items-center justify-center relative z-10">
        <div className="text-center p-4 mb-4">
          <h2 className="text-white text-3xl">
            Enhance Your Collaboration & Skill Development with -{" "}
            <span className="text-[#FCE356] font-semibold ">CollabX</span>
          </h2>
          <p className="text-gray-400 mt-4 text-md">
            Connect with peers and experts for skill exchange and growth. Engage
            in peer matching, collaborate on our coding platform, and refine
            skills with mock interviews & AI debugging. Join discussions &
            webinars to stay ahead! 🚀
          </p>
        </div>

        {/* Responsive grid layout */}
        <div className="flex flex-col">
          {Data.map((item, index) => (
            <Card
              key={index}
              img={item.img}
              title={item.title}
              desc1={item.desc1}
              desc2={item.desc2}
              desc3={item.desc3}
              main={item.main}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feature;
