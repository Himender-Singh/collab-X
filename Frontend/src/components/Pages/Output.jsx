import { useState } from "react";
import { executeCode } from "./api";
import { toast } from "react-toastify";

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
      console.log(error);
      toast.error(error.message || "Unable to run code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-1/3 p-4 border border-gray-300 text-white rounded-lg shadow-lg bg-[#131212]">
      <h2 className="mb-2 text-lg font-semibold">Output</h2>
      <button
        className={`w-full px-4 py-2 mb-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
        onClick={runCode}
      >
        {isLoading ? "Running..." : "Run Code"}
      </button>
      <div
        className={`h-[75vh] p-2 border rounded-md overflow-y-auto ${
          isError ? "border-red-500 text-red-400" : "border-gray-300"
        }`}
      >
        {output
          ? output.map((line, i) => <p key={i}>{line}</p>)
          : 'Click "Run Code" to see the output here'}
      </div>
    </div>
  );
};

export default Output;