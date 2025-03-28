import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setTasks } from "@/redux/authSlice";
import useGetSuggestedUser from "@/hooks/useGetSuggestedUser";
import { server } from "@/main";
import { Calendar, CheckCircle, Clock, XCircle, Plus, X, User, ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";

const Session = () => {
  const dispatch = useDispatch();
  
  const tasks = useSelector((state) => state.auth.tasks) || [];
  const user = useSelector((state) => state.auth?.user) || {};
  const userId = user?._id || "";
  const { suggestedUsers = [] } = useGetSuggestedUser() || {};

  const [sessions, setSessions] = useState([]); 
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [expandedSessionId, setExpandedSessionId] = useState(null);
  const [currentEditTask, setCurrentEditTask] = useState(null);
  const [input, setInput] = useState({
    mentorEmail: "",
    task: "",
    desc: "",
    dateTime: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const formattedSessions = (tasks || [])
      .filter((task) => task?.author === userId)
      .map((task) => ({
        id: task?._id || `Unknown-${Math.random()}`,
        mentor: task?.mentor?.username || "None",
        mentorEmail: task?.mentor?.email || "",
        dateTime: task?.dateTime || new Date().toISOString(),
        isTaskDone: task?.isTaskDone ?? false,
        task: task?.task || "No title available",
        desc: task?.desc || "No description available",
      }));

    setSessions(formattedSessions);
  }, [tasks, userId]);

  const getTaskStatus = (isTaskDone, dateTime) => {
    if (!dateTime) return {
      text: "Unknown",
      icon: <Clock className="w-4 h-4" />,
      color: "bg-gray-500"
    };

    const currentDate = new Date();
    const taskDate = new Date(dateTime);

    if (isTaskDone) return {
      text: "Completed",
      icon: <CheckCircle className="w-4 h-4" />,
      color: "bg-green-500"
    };
    
    return taskDate > currentDate ? {
      text: "Upcoming",
      icon: <Clock className="w-4 h-4" />,
      color: "bg-blue-500"
    } : {
      text: "Overdue",
      icon: <XCircle className="w-4 h-4" />,
      color: "bg-red-500"
    };
  };

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const sessionHandler = async (e) => {
    e.preventDefault();

    if (!input.task || !input.dateTime) {
      toast.error("Title and date are required!");
      return;
    }

    try {
      const res = await axios.post(
        `${server}/task/addTask`,
        {
          ...input,
          dateTime: new Date(input.dateTime).toISOString(),
          mentorEmail: input.mentorEmail || null
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setTasks([...tasks, res.data.task]));
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to schedule session");
    }
  };

  const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      const res = await axios.post(
        `${server}/task/updateTask/${taskId}`,
        {
          isTaskDone: !currentStatus
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setTasks(tasks.map(task => 
          task._id === taskId ? { ...task, isTaskDone: !currentStatus } : task
        )));
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast.error(error.response?.data?.message || "Failed to update task status");
    }
  };

  const updateTaskHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${server}/task/updateTask/${currentEditTask.id}`,
        {
          task: input.task,
          desc: input.desc,
          dateTime: new Date(input.dateTime).toISOString(),
          isTaskDone: currentEditTask.isTaskDone
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setTasks(tasks.map(task => 
          task._id === currentEditTask.id ? { 
            ...task, 
            task: input.task,
            desc: input.desc,
            dateTime: new Date(input.dateTime).toISOString()
          } : task
        )));
        resetForm();
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  };

  const deleteTaskHandler = async (taskId) => {
    try {
      const res = await axios.delete(
        `${server}/task/deleteTask/${taskId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setTasks(tasks.filter(task => task._id !== taskId)));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  };

  const resetForm = () => {
    setInput({
      mentorEmail: "",
      task: "",
      desc: "",
      dateTime: new Date().toISOString().split('T')[0]
    });
    setIsDialogOpen(false);
    setIsEditDialogOpen(false);
    setCurrentEditTask(null);
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const prepareEditForm = (task) => {
    setCurrentEditTask(task);
    setInput({
      mentorEmail: task.mentorEmail,
      task: task.task,
      desc: task.desc,
      dateTime: new Date(task.dateTime).toISOString().split('T')[0]
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Your Tasks</h1>
            <p className="text-gray-400">
              Track and manage all your tasks in one place
            </p>
          </div>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Task
          </button>
        </div>

        <div className="space-y-4">
          {sessions.length > 0 ? (
            sessions.map((session) => {
              const status = getTaskStatus(session.isTaskDone, session.dateTime);
              const isExpanded = expandedSessionId === session.id;
              
              return (
                <div
                  key={session.id}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-indigo-500 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <button 
                          onClick={() => toggleTaskCompletion(session.id, session.isTaskDone)}
                          className={`w-5 h-5 rounded-full border ${session.isTaskDone ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}
                        />
                        <h3 className="text-lg font-semibold text-white">{session.task}</h3>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        {session.mentor !== "None" && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Mentor: {session.mentor}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(session.dateTime)}</span>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                          <h4 className="font-medium mb-2">Description:</h4>
                          <p className="text-gray-300 whitespace-pre-line">{session.desc}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`${status.color} text-white px-3 py-1 rounded-full text-xs flex items-center gap-2`}>
                        {status.icon}
                        {status.text}
                      </span>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                          className="text-gray-400 hover:text-white"
                        >
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        <button 
                          onClick={() => prepareEditForm(session)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => deleteTaskHandler(session.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">No tasks scheduled</h3>
              <p className="text-gray-500 mb-4">Create your first task to get started</p>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
              >
                Create Task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Create New Task</h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={sessionHandler}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Mentor (optional)</label>
                    <select
                      name="mentorEmail"
                      value={input.mentorEmail}
                      onChange={changeEventHandler}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">No mentor</option>
                      {suggestedUsers.map((user) => (
                        <option key={user._id} value={user.email}>{user.username}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date *</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="dateTime"
                        value={input.dateTime}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={changeEventHandler}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                      <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
                    <input
                      name="task"
                      value={input.task}
                      onChange={changeEventHandler}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Task title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea
                      name="desc"
                      value={input.desc}
                      onChange={changeEventHandler}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows="4"
                      placeholder="Detailed description of your task"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditDialogOpen && currentEditTask && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Edit Task</h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={updateTaskHandler}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {currentEditTask.mentor === "None" ? "No mentor assigned" : "Mentor"}
                    </label>
                    <div className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300">
                      {currentEditTask.mentor}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date *</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="dateTime"
                        value={input.dateTime}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={changeEventHandler}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                      <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
                    <input
                      name="task"
                      value={input.task}
                      onChange={changeEventHandler}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea
                      name="desc"
                      value={input.desc}
                      onChange={changeEventHandler}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows="4"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    Update Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Session;