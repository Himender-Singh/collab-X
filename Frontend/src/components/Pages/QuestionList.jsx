import React, { useState } from "react";
import data from "../Global/data.json";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import code from "../../assets/leetcode.png";

const QuestionList = () => {
  const [openTopic, setOpenTopic] = useState(null);

  const toggleTopic = (topic) => {
    setOpenTopic(openTopic === topic ? null : topic);
  };

  return (
    <div>
        <div className="bg-gray-900 p-4 text-white text-center">
          <h1 className="text-4xl p-2 font-semibold">DSA Challenge Sheet</h1>
        </div>
      <div className="container mx-auto p-4 text-white">
        {Object.keys(data).map((topic) => (
          <div key={topic} className="mb-6">
            {/* Topic Header */}
            <button
              onClick={() => toggleTopic(topic)}
              className="w-full flex justify-between items-center p-4 bg-gray-800 rounded-lg text-lg font-semibold shadow-md"
            >
              {topic} Questions
              {openTopic === topic ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {/* Questions Table */}
            {openTopic === topic && (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full border-collapse border border-gray-700">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="border border-gray-700 px-4 py-2 text-left">
                        Sr no.
                      </th>
                      <th className="border border-gray-700 px-4 py-2 text-left">
                        Question
                      </th>
                      <th className="border border-gray-700 px-4 py-2 text-left">
                        Tags
                      </th>
                      <th className="border border-gray-700 px-4 py-2 text-left">
                        Company
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data[topic].map((question, index) => (
                      <tr key={index} className="bg-gray-800 hover:bg-gray-700">
                        <td className="border border-gray-700 px-4 py-2">
                          {index + 1}
                        </td>
                        <td className="border border-gray-700 px-4 py-2">
                          <a
                            href={question.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-600"
                          >
                            {question.question_name}
                          </a>
                        </td>
                        <td className="border border-gray-700 px-4 py-2">
                          <div className="flex flex-wrap gap-1">
                            {question.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-700 text-white rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="border border-gray-700 px-4 py-2 text-center">
                          <a
                            href={question.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={code}
                              alt="LeetCode"
                              className="w-8 h-8 mx-auto rounded-full bg-blue-500 p-1"
                            />
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
