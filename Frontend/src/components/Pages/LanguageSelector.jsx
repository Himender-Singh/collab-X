import { useState, useRef, useEffect } from "react";
import { LANGUAGE_VERSIONS } from "./constant";
import { FiChevronDown, FiCode } from "react-icons/fi";

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({ language, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (lang) => {
    onSelect(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiCode className="text-blue-400" />
        <span className="font-medium">{language}</span>
        <FiChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-md shadow-lg overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {languages.map(([lang, version]) => (
              <button
                key={lang}
                className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors flex justify-between items-center ${
                  lang === language ? "bg-gray-700 text-blue-400" : "text-gray-300"
                }`}
                onClick={() => handleSelect(lang)}
              >
                <span className="capitalize">{lang}</span>
                <span className="text-xs text-gray-500">{version}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;