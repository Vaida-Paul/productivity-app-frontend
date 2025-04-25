import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFolder } from "react-icons/fa";

const JournalPage = ({ theme, onThemeChange }) => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [journals, setJournals] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJournalTitle, setNewJournalTitle] = useState("");
  const [newJournalContent, setNewJournalContent] = useState("");
  const [newJournalTag, setNewJournalTag] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  const fetchJournals = async (searchQuery = "") => {
    try {
      const response = await fetch(`${backendUrl}/api/journals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch journals");
      }

      const data = await response.json();
      console.log("Fetched journals:", data);

    
      const formattedJournals = data.map((journal) => ({
        ...journal,
        createdAt: journal.created_at,
        lastEditedAt: journal.updated_at,
      }));

      
      const filteredJournals = searchQuery
        ? formattedJournals.filter((journal) =>
            journal.tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : formattedJournals;

      setJournals(filteredJournals);
    } catch (error) {
      console.error("Error fetching journals:", error);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);


  const addJournal = async () => {
    try {
      const tag = newJournalTag.trim();
      const token = localStorage.getItem("token");

      const payload = {
        title: newJournalTitle,
        content: newJournalContent,
        tag: tag, 
        user_id: JSON.parse(localStorage.getItem("user")).id,
      };

      console.log("Request payload:", payload); 

      const response = await fetch(`${backendUrl}/api/journals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error response:", errorResponse);
        setError(errorResponse.message || "Failed to add journal");
        throw new Error("Failed to add journal");
      }

      const data = await response.json();
      console.log("Added journal:", data);
      const formattedJournal = {
        ...data,
        createdAt: data.created_at,
        lastEditedAt: data.updated_at,
      };

      setJournals((prevJournals) => [formattedJournal, ...prevJournals]);
      setIsModalOpen(false);
      setNewJournalTitle("");
      setNewJournalContent("");
      setNewJournalTag(""); 
      setError("");
    } catch (error) {
      console.error("Error adding journal:", error);
    }
  };

  const saveJournal = async () => {
    try {
      const tag = (newJournalTag || "").trim();
      const response = await fetch(
        `${backendUrl}/api/journals/${selectedJournal.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: newJournalTitle,
            content: newJournalContent,
            tag: tag, 
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update journal");
      }

      const data = await response.json();
      console.log("Updated journal:", data);

      const formattedJournal = {
        ...data,
        createdAt: data.created_at,
        lastEditedAt: data.updated_at,
      };

      const updatedJournals = journals.map((journal) =>
        journal.id === selectedJournal.id ? formattedJournal : journal
      );
      setJournals(updatedJournals);
      setIsModalOpen(false);
      setNewJournalTitle("");
      setNewJournalContent("");
      setNewJournalTag(""); 
      setError("");
      setError("");
    } catch (error) {
      console.error("Error updating journal:", error);
    }
  };

  const deleteJournal = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/api/journals/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete journal");
      }

      setJournals(journals.filter((journal) => journal.id !== id));
    } catch (error) {
      console.error("Error deleting journal:", error);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredJournals = searchQuery
    ? journals.filter((journal) =>
        journal.tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : journals;

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-100 to-red-100 text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-8">My Journals</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            className={`w-full p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
              theme === "dark"
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-700 border-gray-200"
            }`}
            placeholder="Search by tag..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              fetchJournals(e.target.value);
            }}
          />
        </div>

        {/* Journals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Add Journal Button */}
          <div
            className={`rounded-lg shadow-lg p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-shadow duration-200 flex flex-col items-center justify-center ${
              theme === "dark" ? "bg-gray-700" : "bg-white"
            }`}
            onClick={() => {
              setSelectedJournal(null);
              setIsModalOpen(true);
              setIsEditMode(true);
            }}
          >
            <span className="text-2xl text-purple-600">+</span>
            <span className="mt-2 text-lg text-gray-700 dark:text-white">
              Add New Journal
            </span>
          </div>

          {/* Journal Folders */}
          {filteredJournals.map((journal) => (
            <div
              key={journal.id}
              className={`rounded-lg shadow-lg p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-shadow duration-200 ${
                theme === "dark" ? "bg-gray-700" : "bg-white"
              }`}
              onClick={() => {
                setSelectedJournal(journal);
                setIsModalOpen(true);
                setIsEditMode(false);
              }}
            >
              <div className="flex justify-between items-center">
                <span className="text-2xl text-purple-600">📁</span>
                <button
                  className="text-red-600 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteJournal(journal.id);
                  }}
                >
                  🗑️
                </button>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mt-4">
                {journal.title}
              </h2>
              <div className="mt-2 text-sm text-gray-500">
                <p>Created: {formatDate(journal.createdAt)}</p>
                {journal.lastEditedAt && (
                  <p>Last Edited: {formatDate(journal.lastEditedAt)}</p>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {journal.tag && (
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      theme === "dark"
                        ? "bg-blue-800 text-blue-200"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {journal.tag}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Journal Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div
              className={`rounded-lg shadow-lg w-full max-w-2xl p-6 transform transition-all duration-300 ease-in-out ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-black"
              }`}
            >
              <h2 className="text-2xl font-bold mb-4">
                {selectedJournal ? selectedJournal.title : "New Journal"}
              </h2>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              {isEditMode ? (
                <>
                  <input
                    type="text"
                    className={`w-full p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                    placeholder="Journal Title (1-20 characters)"
                    value={newJournalTitle}
                    onChange={(e) => setNewJournalTitle(e.target.value)}
                    maxLength={20}
                  />
                  <textarea
                    className={`w-full h-48 p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                    placeholder="Write your thoughts here..."
                    value={newJournalContent}
                    onChange={(e) => setNewJournalContent(e.target.value)}
                  />
                  <input
                    type="text"
                    className={`w-full p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4 ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                    placeholder="Tag"
                    value={newJournalTag}
                    onChange={(e) => setNewJournalTag(e.target.value)}
                  />
                </>
              ) : (
                <div
                  className={`w-full h-48 p-4 rounded-lg border overflow-y-auto ${
                    theme === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  {selectedJournal?.content}
                </div>
              )}
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {selectedJournal && (
                    <>
                      <p>Created: {formatDate(selectedJournal.createdAt)}</p>
                      {selectedJournal.lastEditedAt && (
                        <p>
                          Last Edited:{" "}
                          {formatDate(selectedJournal.lastEditedAt)}
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div className="flex space-x-4">
                  {!isEditMode && selectedJournal && (
                    <button
                      className={`px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                        theme === "dark"
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      }`}
                      onClick={() => {
                        setIsEditMode(true);
                        setNewJournalTitle(selectedJournal.title);
                        setNewJournalContent(selectedJournal.content);
                        setNewJournalTag(selectedJournal.tag || "");
                      }}
                    >
                      ✏️ Edit
                    </button>
                  )}
                  <button
                    className={`px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                      theme === "dark"
                        ? "bg-gray-600 text-white hover:bg-gray-500"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsEditMode(false);
                    }}
                  >
                    Cancel
                  </button>
                  {isEditMode && (
                    <button
                      className={`px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                        theme === "dark"
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      }`}
                      onClick={selectedJournal ? saveJournal : addJournal}
                    >
                      {selectedJournal ? "Save" : "Add Journal"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalPage;
