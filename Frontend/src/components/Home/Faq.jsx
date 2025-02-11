import React, { useState } from "react";
import img from "../../assets/bg2.svg";

const Faq = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What is the purpose of COLLABX?",
      answer:
        "COLLABX is designed to connect individuals for skill exchange, peer collaboration, and career growth through features like peer matching, a collaborative code editor, mock interviews, and AI-powered debugging assistance.",
    },
    {
      question: "How does the Peer Matching System work?",
      answer:
        "Our Peer Matching System connects users based on their skills and needs. Whether you're a frontend developer looking for a backend partner or a beginner seeking guidance, COLLABX helps you find the right match.",
    },
    {
      question: "What is the Collaborative Code Editor?",
      answer:
        "The code editor supports multiple programming languages and enables real-time collaboration. It allows users to code together, test solutions, and improve their skills in an interactive environment.",
    },
    {
      question: "How can I prepare for job interviews using COLLABX?",
      answer:
        "Our Mock Interview System provides an environment where users can practice technical interviews, receive feedback, and improve their performance before facing real-world job interviews.",
    },
    {
      question: "What is the AI Debugging Assistant?",
      answer:
        "Our AI-powered debugging tool helps identify errors in your code, provides potential fixes, and explains issues to enhance your problem-solving skills.",
    },
    {
      question: "Does COLLABX offer a community platform?",
      answer:
        "Yes! Our community system enables users to participate in discussions, share knowledge, and engage in skill-based webinars with industry experts.",
    },
    {
      question: "Is COLLABX free to use?",
      answer:
        "Yes, COLLABX offers free access to core features. Some advanced features or exclusive content may be available through premium access.",
    },
  ];
  

  return (
    <div className=" font-mono text-white mx-auto py-16 px-4">
      <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Image Section */}
        <div className="w-full">
          <img src={img} alt="FAQ illustration" className="w-full h-auto rounded-md" />
        </div>

        {/* FAQ Section */}
        <div className="w-full">
          <h2 className="text-3xl font-semibold mb-6">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4 border-b border-gray-300 pb-4 transition-all duration-500 ease-in-out"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="flex justify-between items-center w-full text-left text-lg font-medium text-white focus:outline-none transition-transform duration-300 ease-in-out"
              >
                {faq.question}
                <span
                  className={`ml-4 transform transition-transform ${
                    openFaq === index ? "rotate-180" : "rotate-0"
                  }`}
                >
                  {openFaq === index ? "-" : "+"}
                </span>
              </button>
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  openFaq === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="mt-3 text-gray-300">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
