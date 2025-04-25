import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Settings, Moon, Sun } from "lucide-react";

const TimerButton = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105
      ${
        active
          ? "bg-red-600 text-white shadow-lg scale-105"
          : "bg-red-100 text-red-600 hover:bg-red-200"
      }
    `}
  >
    {children}
  </button>
);

const PomodoroTimer = ({ theme, onThemeChange }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [showSettings, setShowSettings] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");
  const [showStopButton, setShowStopButton] = useState(false);
  const [customSeconds, setCustomSeconds] = useState("");
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    setAudio(new Audio(process.env.PUBLIC_URL + "/ringtone.mp3"));
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (audio) {
        audio.play();
        setShowStopButton(true);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, audio]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleTimeSelect = (minutes) => {
    const totalSeconds = minutes * 60;
    setInitialTime(totalSeconds);
    setTimeLeft(totalSeconds);
    setIsRunning(false);
  };

  const handleCustomTimeSubmit = (e) => {
    e.preventDefault();
    const minutes = parseInt(customMinutes) || 0;
    const seconds = parseInt(customSeconds) || 0;
    const totalSeconds = minutes * 60 + seconds;

    if (totalSeconds > 0 && minutes <= 180) {
      setInitialTime(totalSeconds);
      setTimeLeft(totalSeconds);
      setIsRunning(true);
      setShowSettings(false);

      setTimeout(() => {
        setCustomMinutes("");
        setCustomSeconds("");
      }, 500);
    } else {
      alert("Please enter a valid time (up to 180 minutes).");
    }
  };

  const resetTimer = () => {
    setTimeLeft(initialTime);
    setIsRunning(false);
  };

  const stopRingtone = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setShowStopButton(false);
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <div
      className={`h-[calc(100vh-5rem)] ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-red-50 to-orange-100 text-black"
      } flex items-center justify-center p-4 overflow-hidden`}
    >
      <div
        className={`${
          theme === "dark" ? "bg-gray-700" : "bg-white"
        } rounded-2xl shadow-2xl p-8 w-full max-w-md`}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <svg
              className={`w-8 h-8 ${
                theme === "dark" ? "text-white" : "text-red-600"
              }`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12,2C7.58,2,4,5.58,4,10c0,7,8,12,8,12s8-5,8-12C20,5.58,16.42,2,12,2z M12,15c-2.76,0-5-2.24-5-5 s2.24-5,5-5s5,2.24,5,5S14.76,15,12,15z" />
            </svg>
            <h1
              className={`text-3xl font-bold ${
                theme === "dark" ? "text-white" : "text-red-600"
              }`}
            >
              Pomodoro
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-opacity-20 rounded-full transition-colors duration-200"
            >
              <Settings
                className={`w-6 h-6 ${
                  theme === "dark" ? "text-white" : "text-red-600"
                }`}
              />
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="mb-6 animate-fade-in">
            <form onSubmit={handleCustomTimeSubmit} className="flex gap-2">
              <input
                type="number"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                placeholder="Minutes"
                className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "bg-gray-600 text-white border-gray-500 focus:ring-red-400"
                    : "bg-white text-gray-900 border-gray-300 focus:ring-red-400"
                }`}
                min="0"
                max="180"
              />
              <input
                type="number"
                value={customSeconds}
                onChange={(e) => setCustomSeconds(e.target.value)}
                placeholder="Seconds"
                className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "bg-gray-600 text-white border-gray-500 focus:ring-red-400"
                    : "bg-white text-gray-900 border-gray-300 focus:ring-red-400"
                }`}
                min="0"
                max="59"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Start
              </button>
            </form>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          {[15, 30, 45, 60, 75].map((time) => (
            <TimerButton
              key={time}
              active={initialTime === time * 60}
              onClick={() => handleTimeSelect(time)}
            >
              {time}m
            </TimerButton>
          ))}
        </div>

        <div className="relative mb-8">
          <div
            className={`w-full h-4 ${
              theme === "dark" ? "bg-gray-600" : "bg-red-100"
            } rounded-full overflow-hidden`}
          >
            <div
              className="h-full bg-red-600 transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <span
            className={`text-6xl font-bold font-mono ${
              theme === "dark" ? "text-white" : "text-red-600"
            }`}
          >
            {formatTime(timeLeft)}
          </span>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
          >
            {isRunning ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={resetTimer}
            className={`flex items-center gap-2 px-6 py-3 ${
              theme === "dark"
                ? "bg-gray-600 text-white hover:bg-gray-500"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } rounded-lg transition-all duration-200 transform hover:scale-105`}
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>
      </div>
      {showStopButton && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <button
            onClick={stopRingtone}
            className="px-8 py-4 bg-white text-red-600 text-xl font-bold rounded-lg shadow-lg"
          >
            STOP
          </button>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;
