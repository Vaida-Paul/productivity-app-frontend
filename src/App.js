import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import EisenhowerKanban from "./components/EisenhowerKanban";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import PomodoroTimer from "./components/Pomodoro";
import JournalPage from "./components/JournalPage";

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      {user && (
        <Navbar
          username={user.username}
          onLogout={handleLogout}
          theme={theme}
          onThemeChange={handleThemeChange}
        />
      )}
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route
          path="/dashboard"
          element={
            user ? <EisenhowerKanban theme={theme} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
        <Route
          path="/pomodoro"
          element={
            user ? (
              <PomodoroTimer theme={theme} onThemeChange={handleThemeChange} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/journal"
          element={
            user ? (
              <JournalPage theme={theme} onThemeChange={handleThemeChange} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
