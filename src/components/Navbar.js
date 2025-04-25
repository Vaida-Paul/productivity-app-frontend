import React, { useState } from "react";
import { MdDarkMode, MdLightMode, MdMenu } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { GiTomato } from "react-icons/gi";
import { RiTaskFill } from "react-icons/ri";
import { IoIosJournal } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";

const Navbar = ({ username, onLogout, theme, onThemeChange }) => {
  const location = useLocation();
  const [isSpinning, setIsSpinning] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isPomodoroPage = location.pathname === "/pomodoro";
  const isJournalPage = location.pathname === "/journal";

  const pomodoroIcon = isPomodoroPage ? (
    <RiTaskFill className="text-green-500" size={24} />
  ) : (
    <GiTomato className="text-red-500 animate-bounce" size={24} />
  );

  const journalIcon = isJournalPage ? (
    <RiTaskFill className="text-green-500" size={24} />
  ) : (
    <IoIosJournal className="text-blue-500" size={24} />
  );

  const handleToggle = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 3000);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`sticky top-0 z-50 p-4 ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
      } shadow-md`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Welcome, {username}</h1>

        {/* Hamburger Menu Button (Visible only on mobile) */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <MdMenu size={24} className="text-blue-500" />
        </button>

        {/* Desktop Buttons (Hidden on mobile) */}
        <div className="hidden md:flex gap-4">
          {/* Journal Button */}
          <Link
            to={isJournalPage ? "/dashboard" : "/journal"}
            className={`relative flex items-center justify-center px-6 py-3 rounded-full transition-all duration-500 ease-in-out ${
              theme === "dark"
                ? "bg-gradient-to-r from-gray-700 to-gray-800"
                : "bg-gradient-to-r from-gray-100 to-gray-200"
            } shadow-lg transform hover:scale-110 hover:shadow-2xl`}
          >
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${
                isJournalPage
                  ? "from-blue-500 to-blue-600"
                  : "from-blue-400 to-blue-500"
              } opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100`}
            ></div>

            <div className="absolute inset-0 flex items-center justify-center">
              {journalIcon}
            </div>

            <div
              className={`absolute inset-0 rounded-full ring-2 ${
                isJournalPage ? "ring-blue-500" : "ring-blue-400"
              } opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100`}
            ></div>
          </Link>

          {/* Pomodoro Button */}
          <Link
            to={isPomodoroPage ? "/dashboard" : "/pomodoro"}
            className={`relative flex items-center justify-center px-6 py-3 rounded-full transition-all duration-500 ease-in-out ${
              theme === "dark"
                ? "bg-gradient-to-r from-gray-700 to-gray-800"
                : "bg-gradient-to-r from-gray-100 to-gray-200"
            } shadow-lg transform hover:scale-110 hover:shadow-2xl `}
            onClick={handleToggle}
          >
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${
                isPomodoroPage
                  ? "from-green-500 to-green-600"
                  : "from-red-500 to-red-600"
              } opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100`}
            ></div>

            <div className="absolute inset-0 flex items-center justify-center">
              {pomodoroIcon}
            </div>

            <div
              className={`absolute inset-0 rounded-full ${
                isPomodoroPage ? "ring-2 ring-green-500" : "ring-2 ring-red-500"
              } opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100`}
            ></div>
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={onThemeChange}
            className={`relative flex items-center justify-center px-6 py-3 rounded-full transition-all duration-300 ease-in-out ${
              theme === "dark"
                ? "bg-gradient-to-r from-purple-600 to-indigo-700 text-white"
                : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black"
            } shadow-lg transform hover:scale-105 hover:shadow-xl`}
          >
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
                theme === "dark" ? "opacity-100" : "opacity-0"
              }`}
            >
              <MdDarkMode size={24} />
            </div>
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
                theme === "light" ? "opacity-100" : "opacity-0"
              }`}
            >
              <MdLightMode size={24} />
            </div>
            <div
              className={`absolute inset-0 rounded-full bg-opacity-40 transition-all duration-300 ease-in-out ${
                theme === "dark" ? "bg-gray-700" : "bg-yellow-300"
              }`}
            ></div>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full shadow-md transition-transform duration-300 hover:scale-105"
          >
            Logout
            <MdOutlineLogout size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu (Compact Square Popover) */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleMenu}
          ></div>

          {/* Compact Square Menu */}
          <div
            className={`fixed top-16 right-4 w-64 p-6 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            {/* Close Button (IoMdCloseCircle) */}
            <button
              onClick={toggleMenu}
              className="absolute top-2 right-4 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <IoMdCloseCircle
                size={28}
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                } text-red-500`}
              />
            </button>

            {/* Buttons */}
            <div className="mt-8 space-y-4">
              {/* Journal Button */}
              <Link
                to={isJournalPage ? "/dashboard" : "/journal"}
                className={`flex items-center justify-center w-full px-4 py-3 rounded-full transition-all duration-300 ease-in-out ${
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-black"
                } shadow-md hover:bg-opacity-80`}
              >
                {journalIcon}
                <span className="ml-2">
                  {isJournalPage ? "Tasks" : "Journal"}
                </span>
              </Link>

              {/* Pomodoro Button */}
              <Link
                to={isPomodoroPage ? "/dashboard" : "/pomodoro"}
                className={`flex items-center justify-center w-full px-4 py-3 rounded-full transition-all duration-300 ease-in-out ${
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-black"
                } shadow-md hover:bg-opacity-80`}
              >
                {pomodoroIcon}
                <span className="ml-2">
                  {isPomodoroPage ? "Tasks" : "Pomodoro"}
                </span>
              </Link>

              {/* Theme Toggle Button */}
              <button
                onClick={onThemeChange}
                className={`flex items-center justify-center w-full px-4 py-3 rounded-full transition-all duration-300 ease-in-out ${
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-black"
                } shadow-md hover:bg-opacity-80`}
              >
                {theme === "dark" ? (
                  <MdDarkMode size={20} />
                ) : (
                  <MdLightMode size={20} />
                )}
                <span className="ml-2">Theme</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className={`flex items-center justify-center w-full px-4 py-3 rounded-full transition-all duration-300 ease-in-out ${
                  theme === "dark"
                    ? "bg-red-600 text-white"
                    : "bg-red-500 text-white"
                } shadow-md hover:bg-opacity-80`}
              >
                <MdOutlineLogout size={20} />
                <span className="ml-2">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
