import { useState } from "react";
import { executeCode } from "./api";
import { toast } from "react-toastify";
import { VscRunAll } from "react-icons/vsc";
import { FiLoader } from "react-icons/fi";

const Output = ({ editorRef, language }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      toast.error(error.message || "Unable to run code");
      setOutput([error.message]);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 h-[38rem] overflow-x-hidden flex flex-col p-4">
      <button
        className={`flex items-center justify-center space-x-2 px-4 py-2 mb-4 rounded-md transition-colors ${
          isLoading
            ? "bg-blue-700 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-500"
        } text-white`}
        disabled={isLoading}
        onClick={runCode}
      >
        {isLoading ? (
          <>
            <FiLoader className="animate-spin" />
            <span>Running...</span>
          </>
        ) : (
          <>
            <VscRunAll />
            <span>Run Code</span>
          </>
        )}
      </button>

      <div
        className={`flex-1 p-4 rounded-md font-mono text-sm overflow-auto ${
          isError
            ? "bg-red-900/20 text-red-400 border border-red-800"
            : "bg-gray-900/50 text-gray-300 border border-gray-700"
        }`}
      >
        {output ? (
          output.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">
              {line}
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Click "Run Code" to see output
          </div>
        )}
      </div>
    </div>
  );
};

export default Output;