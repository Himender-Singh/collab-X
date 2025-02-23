import { useState, useRef, useEffect } from "react";
import { LANGUAGE_VERSIONS } from "./constant";

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "text-blue-400";

const LanguageSelector = ({ language, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility
  const dropdownRef = useRef(null); // Ref to handle clicks outside the dropdown

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (lang) => {
    onSelect(lang); // Call the parent's onSelect function
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="ml-2 mb-4 p-2 border rounded-lg w-1/2 bg-white shadow">
      {/* <h2 className="mb-2 text-lg font-semibold">Language:</h2> */}
      <div className="relative inline-block w-full" ref={dropdownRef}>
        {/* Dropdown Button */}
        <button
          className="w-full px-4 py-2 text-left bg-gray-100 border rounded-md focus:outline-none hover:bg-gray-200 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {language}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-[999] left-0 mt-2 w-full bg-white border rounded-md shadow-lg">
            {languages.map(([lang, version]) => (
              <div
                key={lang}
                className={`px-4 py-2 cursor-pointer ${
                  lang === language
                    ? ACTIVE_COLOR + " bg-gray-200"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => handleSelect(lang)}
              >
                {lang}{" "}
                <span className="text-gray-500 text-sm">({version})</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;