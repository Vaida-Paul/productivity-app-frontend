import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

const EisenhowerKanban = ({ theme }) => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [tasks, setTasks] = useState({
    doFirst: [{ id: 1, text: "Logout and then login again", deadline: "" }],
    schedule: [{ id: 2, text: "Logout and then login again", deadline: "" }],
    delegate: [{ id: 3, text: "Logout and then login again", deadline: "" }],
    dontDo: [{ id: 4, text: "Logout and then login again", deadline: null }],
  });

  const [newTask, setNewTask] = useState("");
  const [selectedQuadrant, setSelectedQuadrant] = useState("doFirst");
  const [taskDate, setTaskDate] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const addTask = async (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      try {
        const response = await fetch(`${backendUrl}/api/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            text: newTask,
            deadline: taskDate || null,
            quadrant: selectedQuadrant,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setTasks((prev) => ({
            ...prev,
            [selectedQuadrant]: [...prev[selectedQuadrant], data],
          }));
          setNewTask("");
          setTaskDate("");
        }
      } catch (error) {
        console.error("Failed to add task", error);
      }
    } else {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const removeTask = async (quadrant, taskId) => {
    try {
      const response = await fetch(`${backendUrl}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setTasks((prev) => ({
          ...prev,
          [quadrant]: prev[quadrant].filter((task) => task.id !== taskId),
        }));
      }
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const onDrop = async (e, targetQuadrant) => {
    e.preventDefault();
    const task = JSON.parse(e.dataTransfer.getData("task"));
    const sourceQuadrant = e.dataTransfer.getData("sourceQuadrant");

    if (sourceQuadrant !== targetQuadrant) {
      try {
        const response = await fetch(`${backendUrl}/api/tasks/${task.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ quadrant: targetQuadrant }),
        });

        if (response.ok) {
          setTasks((prev) => ({
            ...prev,
            [sourceQuadrant]: prev[sourceQuadrant].filter(
              (t) => t.id !== task.id
            ),
            [targetQuadrant]: [...prev[targetQuadrant], task],
          }));
        } else {
          console.error("Failed to update task:", await response.json());
        }
      } catch (error) {
        console.error("Failed to update task", error);
      }
    }
  };
  const onDragStart = (e, task, sourceQuadrant) => {
    e.dataTransfer.setData("task", JSON.stringify(task));
    e.dataTransfer.setData("sourceQuadrant", sourceQuadrant);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setTasks({
            doFirst: data.filter((task) => task.quadrant === "doFirst"),
            schedule: data.filter((task) => task.quadrant === "schedule"),
            delegate: data.filter((task) => task.quadrant === "delegate"),
            dontDo: data.filter((task) => task.quadrant === "dontDo"),
          });
        }
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      }
    };

    fetchTasks();
  }, []);

  const quadrantStyles = {
    doFirst:
      theme === "dark"
        ? "bg-red-900 border-red-700 text-white"
        : "bg-red-50 border-red-200",
    schedule:
      theme === "dark"
        ? "bg-blue-900 border-blue-700 text-white"
        : "bg-blue-50 border-blue-200",
    delegate:
      theme === "dark"
        ? "bg-yellow-900 border-yellow-700 text-white"
        : "bg-yellow-50 border-yellow-200",
    dontDo:
      theme === "dark"
        ? "bg-gray-900 border-gray-700 text-white"
        : "bg-gray-50 border-gray-200",
  };

  const quadrantTitles = {
    doFirst: "Do First (Urgent & Important)",
    schedule: "Schedule (Not Urgent, Important)",
    delegate: "Delegate (Urgent, Not Important)",
    dontDo: "Don't Do (Not Urgent, Not Important)",
  };

  return (
    <div
      className={`p-6 max-w-6xl mx-auto ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="text-2xl font-bold mb-6">Eisenhower Matrix Kanban</h1>

      {showAlert && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            theme === "dark"
              ? "bg-red-800 border-red-700 text-white"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <p>Please enter a task before adding</p>
        </div>
      )}

      <form onSubmit={addTask} className="mb-8 flex gap-4 flex-wrap">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className={`flex-1 min-w-[200px] p-2 border rounded ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
        />
        <input
          type="date"
          value={taskDate}
          onChange={(e) => setTaskDate(e.target.value)}
          className={`p-2 border rounded ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
        />
        <select
          value={selectedQuadrant}
          onChange={(e) => setSelectedQuadrant(e.target.value)}
          className={`p-2 border rounded ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
        >
          {Object.entries(quadrantTitles).map(([key, title]) => (
            <option key={key} value={key}>
              {title}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className={`px-4 py-2 rounded flex items-center gap-2 transition-colors ${
            theme === "dark"
              ? "bg-blue-700 text-white hover:bg-blue-800"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          <Plus size={20} />
          Add Task
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(tasks).map(([quadrant, quadrantTasks]) => (
          <div
            key={quadrant}
            className={`p-4 rounded-lg border ${quadrantStyles[quadrant]}`}
            onDragOver={onDragOver}
            style={{ touchAction: "none" }}
            onDrop={(e) => onDrop(e, quadrant)}
          >
            <h2 className="text-lg font-semibold mb-4">
              {quadrantTitles[quadrant]}
            </h2>
            <div className="space-y-2">
              {quadrantTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  style={{ touchAction: "none" }}
                  onDragStart={(e) => onDragStart(e, task, quadrant)}
                  className={`p-3 rounded shadow-sm border flex justify-between items-center cursor-move ${
                    theme === "dark"
                      ? "bg-gray-800 text-white border-gray-700"
                      : "bg-white text-black border-gray-300"
                  }`}
                >
                  <div>
                    <p>{task.text}</p>
                    {task.deadline && (
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Due: {task.deadline}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeTask(quadrant, task.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}

              {quadrantTasks.length === 0 && (
                <p className="text-gray-500 text-center p-4">
                  No tasks in this quadrant
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EisenhowerKanban;
