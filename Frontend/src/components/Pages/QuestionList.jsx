import React, { useState } from "react";
import data from "../Global/data.json";
import { FaChevronDown, FaChevronUp, FaExternalLinkAlt } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { BsTagsFill } from "react-icons/bs";
import { HiOutlineHashtag } from "react-icons/hi";

const QuestionList = () => {
  const [openTopic, setOpenTopic] = useState(null);

  const toggleTopic = (topic) => {
    setOpenTopic(openTopic === topic ? null : topic);
  };

  // Color variations for tags
  const tagColors = [
    "bg-gradient-to-r from-purple-500 to-indigo-600",
    "bg-gradient-to-r from-rose-500 to-pink-600",
    "bg-gradient-to-r from-amber-500 to-orange-600",
    "bg-gradient-to-r from-emerald-500 to-teal-600",
    "bg-gradient-to-r from-blue-500 to-cyan-600",
  ];

  return (
    <div className="min-h-screen font-mono bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-800 p-8 text-center shadow-xl">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
          DSA Challenge Sheet
        </h1>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Master your Data Structures and Algorithms skills with this curated
          collection of problems
        </p>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {Object.keys(data).map((topic) => (
          <div key={topic} className="mb-8">
            {/* Topic Header */}
            <button
              onClick={() => toggleTopic(topic)}
              className={`w-full flex justify-between items-center p-5 rounded-xl shadow-lg transition-all duration-300 ${
                openTopic === topic
                  ? "bg-gradient-to-r from-indigo-700 to-purple-700"
                  : "bg-gray-800 hover:bg-gray-750"
              }`}
            >
              <div className="flex items-center space-x-3">
                <HiOutlineHashtag className="text-xl text-blue-400" />
                <h2 className="text-xl font-bold text-white">{topic}</h2>
                <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                  {data[topic].length} problems
                </span>
              </div>
              {openTopic === topic ? (
                <FaChevronUp className="text-gray-300" />
              ) : (
                <FaChevronDown className="text-gray-300" />
              )}
            </button>

            {/* Questions Table */}
            {openTopic === topic && (
              <div className="mt-4 overflow-hidden rounded-xl shadow-lg">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-300">
                        #
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-300">
                        Problem
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-300">
                        <div className="flex items-center">
                          <BsTagsFill className="mr-2" />
                          Tags
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-300">
                        Solve
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {data[topic].map((question, index) => (
                      <tr
                        key={index}
                        className="bg-gray-850 hover:bg-gray-800 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300 font-mono">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={question.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center space-x-2"
                          >
                            <span className="text-white group-hover:text-blue-400 transition-colors">
                              {question.question_name}
                            </span>
                            <FaExternalLinkAlt className="text-xs text-gray-500 group-hover:text-blue-400 transition-colors" />
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {question.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className={`px-3 py-1 text-xs rounded-full text-white ${
                                  tagColors[idx % tagColors.length]
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <a
                            href={question.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center p-2 rounded-full bg-gray-700 hover:bg-blue-600 transition-colors"
                            title="Solve on LeetCode"
                          >
                            <SiLeetcode className="text-xl text-orange-400" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;