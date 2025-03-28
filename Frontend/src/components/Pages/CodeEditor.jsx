import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import Output from "./Output";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "./constant";
import { toast } from "react-toastify";
import { FiSun, FiMoon, FiRefreshCw, FiMinus, FiPlus } from "react-icons/fi";
import { RiTerminalLine } from "react-icons/ri";
import { VscRunAll } from "react-icons/vsc";

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
    setIsEditorReady(true);
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language] || "");
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "vs-dark" ? "light" : "vs-dark"));
  };

  const adjustFontSize = (increase) => {
    setFontSize((prevSize) => Math.max(10, Math.min(24, increase ? prevSize + 1 : prevSize - 1)));
  };

  const resetCode = () => {
    setValue(CODE_SNIPPETS[language] || "");
    toast.success("Code reset to default!");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-3 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <RiTerminalLine className="text-blue-400 text-2xl" />
          <h1 className="text-xl font-bold text-white">CollabX Code Editor</h1>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSelector language={language} onSelect={onSelect} />
          
          <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-2 py-1">
            <button 
              onClick={() => adjustFontSize(false)}
              className="text-gray-300 hover:text-white p-1 rounded hover:bg-gray-600"
            >
              <FiMinus size={16} />
            </button>
            <span className="text-sm text-gray-300 w-8 text-center">{fontSize}px</span>
            <button 
              onClick={() => adjustFontSize(true)}
              className="text-gray-300 hover:text-white p-1 rounded hover:bg-gray-600"
            >
              <FiPlus size={16} />
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
          >
            {theme === "vs-dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
            <span>{theme === "vs-dark" ? "Light" : "Dark"}</span>
          </button>

          <button
            onClick={resetCode}
            className="flex items-center space-x-2 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <FiRefreshCw size={18} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Section */}
        <div className="flex-1 flex flex-col border-r border-gray-700">
          <Editor
            options={{
              minimap: { enabled: false },
              fontSize: fontSize,
              readOnly: !isEditorReady,
              scrollBeyondLastLine: false,
              padding: { top: 20 },
              wordWrap: "on",
            }}
            theme={theme}
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
            className="flex-1"
          />
        </div>

        {/* Output Section */}
        <div className="w-1/3 h-full flex flex-col bg-gray-800">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            
            <Output editorRef={editorRef} language={language} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;