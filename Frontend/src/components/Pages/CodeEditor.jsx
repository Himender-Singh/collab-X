import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import Output from "./Output";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS } from "./constant";
import { toast } from "react-toastify";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";


const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("java");
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14); // State for font size
  const [isEditorReady, setIsEditorReady] = useState(false); // State to track editor readiness

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
    setIsEditorReady(true); // Set editor as ready
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language] || "");
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "vs-dark" ? "vs-light" : "vs-dark"));
  };

  const increaseFontSize = () => {
    setFontSize((prevSize) => Math.min(24, prevSize + 2)); // Cap font size at 24
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => Math.max(10, prevSize - 2)); // Cap font size at 10
  };

  const resetCode = () => {
    setValue(CODE_SNIPPETS[language] || "");
    toast.success("Code reset to default!");
  };

  return (
    <div className="flex gap-4 bg-[#131212] p-4 h-screen">
      {/* Editor Section */}
      <div className="w-2/3 h-full p-4 border border-gray-300 rounded-lg shadow-lg bg-[#131212]">
        <div className="flex justify-between items-center mb-2">
          {/* Logo Section */}
          <Link to={"/feed"}>
            <div className="mb-4 text-white flex items-center space-x-3">
              <img src={logo} alt="Logo" className="w-12" />
              <span className="text-xl font-semibold">CollabX</span>
            </div>
          </Link>

          <LanguageSelector language={language} onSelect={onSelect} />

          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {theme === "vs-dark" ? "Light Theme" : "Dark Theme"}
            </button>
            <button
              onClick={resetCode}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Reset Code
            </button>
          </div>
        </div>

        {/* Font Size Adjustments */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={decreaseFontSize}
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            A-
          </button>
          <button
            onClick={increaseFontSize}
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            A+
          </button>
        </div>

        {/* Code Editor */}
        <Editor
          options={{
            minimap: { enabled: false },
            fontSize: fontSize, // Dynamic font size
            readOnly: !isEditorReady, // Disable editor until ready
          }}
          height="70vh" // Adjusted height for additional UI
          theme={theme}
          language={language}
          defaultValue={CODE_SNIPPETS[language]}
          onMount={onMount}
          value={value}
          onChange={(value) => setValue(value)}
        />
      </div>

      {/* Output Section */}
      <Output editorRef={editorRef} language={language} />
    </div>
  );
};

export default CodeEditor;
