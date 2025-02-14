import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setTasks } from "@/redux/authSlice";
import useGetSuggestedUser from "@/hooks/useGetSuggestedUser";
import { server } from "@/main";

const Session = () => {
  const dispatch = useDispatch();
  
  // Ensure tasks has a default value
  const tasks = useSelector((state) => state.auth.tasks) || [];

  // Ensure user object exists
  const user = useSelector((state) => state.auth?.user) || {};
  const userId = user?._id || "";

  // Ensure suggestedUsers is always an array
  const { suggestedUsers = [] } = useGetSuggestedUser() || {};

  const [sessions, setSessions] = useState([]); 
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [input, setInput] = useState({
    mentorEmail: "",
    task: "",
    dateTime: "",
  });

  // Fetch and filter tasks safely
  useEffect(() => {
    console.log("Fetched tasks:", tasks);

    const formattedSessions = (tasks || [])
      .filter((task) => task?.author === userId) // Ensure task exists
      .map((task) => ({
        id: task?._id || `Unknown-${Math.random()}`,
        mentor: task?.mentor?.username || "Mentor not found",
        dateTime: task?.dateTime || new Date().toISOString(),
        isTaskDone: task?.isTaskDone ?? false,
        task: task?.task || "No description available",
      }));

    console.log("Formatted sessions:", formattedSessions);
    setSessions(formattedSessions);
  }, [tasks, userId]);

  // Function to determine task status
  const getTaskStatus = (isTaskDone, dateTime) => {
    if (!dateTime) return "Unknown"; // Handle missing dateTime

    const currentDate = new Date();
    const taskDate = new Date(dateTime);

    if (isTaskDone) return "Completed";
    return taskDate > currentDate ? "Upcoming" : "Pending";
  };

  // Input change handler
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Handle session creation
  const sessionHandler = async (e) => {
    e.preventDefault();

    // Validate input before sending request
    if (!input.mentorEmail || !input.task || !input.dateTime) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const res = await axios.post(
        `${server}/task/addTask`,
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setTasks([...tasks, res.data.task]));

        setInput({ mentorEmail: "", task: "", dateTime: "" });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error scheduling session:", error);
      toast.error("Failed to schedule session. Try again.");
    }
  };

  return (
    <div className="w-full font-poppins text-white h-full">
      <div className="border-b border-gray-400 h-14 bg-[#0e082b]" />
      <div className="container max-w-screen-lg mx-auto mt-6 px-4">
        <h2 className="text-3xl font-bold mb-2">Explore Your Session History</h2>
        <p className="text-md text-gray-400 font-semibold">
          Discover a comprehensive timeline of all your sessions with CareerCompass.
        </p>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-4"
        >
          Schedule a Session
        </button>
      </div>

      {/* Session List */}
      <div className="container max-w-screen-lg mx-auto mt-10 px-4">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <div
              key={session.id}
              className="bg-[#0f172a] border border-gray-500 p-4 rounded-lg mb-4 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="md:flex-1">
                <h3 className="text-xl font-semibold">{session.task}</h3>
                <p className="text-gray-400 mt-2">
                  <strong>Mentor:</strong> {session.mentor}
                </p>
                <p className="text-gray-400">
                  <strong>Date:</strong> {new Date(session.dateTime).toLocaleString()}
                </p>
              </div>
              <span
                className={`mt-2 md:mt-0 md:ml-4 px-3 py-1 rounded-full text-sm ${
                  getTaskStatus(session.isTaskDone, session.dateTime) === "Completed"
                    ? "bg-green-600"
                    : getTaskStatus(session.isTaskDone, session.dateTime) === "Upcoming"
                    ? "bg-blue-600"
                    : "bg-red-600"
                }`}
              >
                {getTaskStatus(session.isTaskDone, session.dateTime)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No sessions available.</p>
        )}
      </div>

      {/* Dialog for Scheduling a Session */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#1f2937] p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Schedule a New Session</h3>
            <form onSubmit={sessionHandler}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Mentor Email</label>
                <select
                  name="mentorEmail"
                  value={input.mentorEmail}
                  onChange={changeEventHandler}
                  className="w-full px-3 py-2 bg-[#374151] rounded-lg text-white"
                  required
                >
                  <option value="" disabled>Select a mentor</option>
                  {suggestedUsers.map((user) => (
                    <option key={user._id} value={user.email}>{user.username}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  name="dateTime"
                  value={input.dateTime}
                  onChange={changeEventHandler}
                  className="w-full px-3 py-2 bg-[#374151] rounded-lg text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  name="task"
                  value={input.task}
                  onChange={changeEventHandler}
                  className="w-full px-3 py-2 bg-[#374151] rounded-lg text-white"
                  rows="3"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Session;
