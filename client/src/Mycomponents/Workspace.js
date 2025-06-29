import React, { useEffect, useState } from 'react';
import './Workspace.css';
import cartoonImages from './cartoonImages';


const streams = {
  cafe: {
    name: "Café Atmosphere",
    url: "https://www.youtube.com/embed/SORD03t7nlo?autoplay=1&mute=1&loop=1&playlist=SORD03t7nlo"
  },
  rain: {
    name: "Rain Sound",
    url: "https://www.youtube.com/embed/Jvgx5HHJ0qw?autoplay=1&mute=1&loop=1&playlist=Jvgx5HHJ0qw"
  },
  office: {
    name: "Office Setup",
    url: "https://www.youtube.com/embed/HOSF4VGRJuc?autoplay=1&mute=1&loop=1&playlist=HOSF4VGRJuc"
  },
  library: {
    name: "Library Quiet",
    url: "https://www.youtube.com/embed/4vIQON2fDWM?autoplay=1&mute=1&loop=1&playlist=4vIQON2fDWM"
  },
  study: {
    name: "Study Session",
    url: "https://www.youtube.com/embed/lTRiuFIWV54?autoplay=1&mute=1&loop=1&playlist=lTRiuFIWV54"
  }
};

function Workspace() {
  const [selectedStream, setSelectedStream] = useState('');
  const [hasUserSelected, setHasUserSelected] = useState(false);
  const [quote, setQuote] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cartoonIndex, setCartoonIndex] = useState(Math.floor(Math.random() * cartoonImages.length));
  const [quoteAuthor, setQuoteAuthor] = useState('Workspace Inspiration');

  useEffect(() => {
    let interval = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(t => t - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      playNotificationSound();
      setIsActive(false);
      const nextTime = isBreak ? workTime : breakTime;
      setIsBreak(!isBreak);
      setTimeRemaining(nextTime * 60);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining, workTime, breakTime, isBreak]);

  useEffect(() => {
    const fetchQuoteAndImage = async () => {
      try {
        const response = await fetch('https://your-workspace.onrender.com/quote');
        const data = await response.json();
        setQuote(data.quote || "Stay focused and productive!");
        setQuoteAuthor(data.username || "Anonymous");
      } catch {
        setQuote("Stay focused and productive!");
        setQuoteAuthor("Workspace Inspiration");
      }

      setCartoonIndex(Math.floor(Math.random() * cartoonImages.length));
    };

    fetchQuoteAndImage();
    const interval = setInterval(fetchQuoteAndImage, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.5);
    } catch {
      console.log("Audio not supported");
    }
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask.trim(), completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = id => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = id => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleStart = () => setIsActive(!isActive);

  const handleReset = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeRemaining(workTime * 60);
  };

  const handleWorkTimeChange = minutes => {
    setWorkTime(minutes);
    if (!isBreak && !isActive) setTimeRemaining(minutes * 60);
  };

  const handleBreakTimeChange = minutes => {
    setBreakTime(minutes);
    if (isBreak && !isActive) setTimeRemaining(minutes * 60);
  };

  const total = isBreak ? breakTime * 60 : workTime * 60;
  const elapsed = total - timeRemaining;
  const minuteAngle = (elapsed / total) * 360;

  return (
    <div className="workspace-container">
      {/* 🎥 Top-left: Video */}
      <div className="video-section">
        <div className="dropdown-container">
          <label htmlFor="streamSelect">🎵 Choose Ambience: </label>
          <select
            id="streamSelect"
            className="custom-select"
            value={selectedStream}
            onChange={(e) => {
              setSelectedStream(e.target.value);
              setHasUserSelected(true);
            }}
          >
            <option value="" disabled>-- Select Ambience --</option>
            {Object.entries(streams).map(([key, stream]) => (
              <option key={key} value={key}>{stream.name}</option>
            ))}
          </select>
        </div>
        {hasUserSelected && selectedStream && (
          <div className="video-frame">
            <iframe
              src={streams[selectedStream].url}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={streams[selectedStream].name}
            />
          </div>
        )}

      </div>

      {/* 💬 Bottom-left: Quote */}
      <div className="quote-section">
        <div className="cartoon-container">
          <img
            src={cartoonImages[cartoonIndex]}
            alt="Mascot"
          />
        </div>

        <div className="quote-bubble">
          "{quote}"
          <div className="quote-author">— {quoteAuthor}</div>
        </div>

      </div>

      {/* ✅ Top-right: To-do List */}
      <div className="todo-section">
        <h2 className="todo-title">📋 Today's Focus</h2>
        <div className="add-task-form">
          <input
            type="text"
            className="task-input"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <button className="add-button" onClick={addTask}>➕</button>
        </div>
        <div className="todo-list">
          {tasks.length === 0 ? (
            <div className="empty-state">No tasks yet. Add one to get started!</div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="todo-item">
                <div className={`todo-checkbox ${task.completed ? 'checked' : ''}`} onClick={() => toggleTask(task.id)}>
                  {task.completed && '✓'}
                </div>
                <span className={`todo-text ${task.completed ? 'completed' : ''}`}>{task.text}</span>
                <div className="delete-button" onClick={() => deleteTask(task.id)}>🗑️</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ⏰ Bottom-right: Analog Clock Timer */}
      <div className="timer-section">
        <div className="timer-clock">
          <div className="clock-face">
            <div className="clock-number num-12">12</div>
            <div className="clock-number num-3">3</div>
            <div className="clock-number num-6">6</div>
            <div className="clock-number num-9">9</div>
            <div className="clock-center"></div>
            <div className="minute-hand" style={{ transform: `rotate(${minuteAngle}deg)` }}></div>
          </div>
        </div>

        <div className="timer-controls">
          <div className="control-group">
            <label className="control-label">Work Time:</label>
            <select
              className="timer-select"
              value={workTime}
              onChange={(e) => handleWorkTimeChange(Number(e.target.value))}
              disabled={isActive}
            >
              <option value={15}>15 min</option>
              <option value={25}>25 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>60 min</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">Break Time:</label>
            <select
              className="timer-select"
              value={breakTime}
              onChange={(e) => handleBreakTimeChange(Number(e.target.value))}
              disabled={isActive}
            >
              <option value={5}>5 min</option>
              <option value={10}>10 min</option>
              <option value={15}>15 min</option>
              <option value={20}>20 min</option>
            </select>
          </div>

          <div className="timer-buttons">
            <button className="timer-button" onClick={handleStart}>
              {isActive ? '⏸️ Pause' : isBreak ? '▶️ Start Break' : '▶️ Start Focus'}
            </button>
            <button className="timer-button" onClick={handleReset}>🔄 Reset</button>
          </div>
        </div>
      </div>
      {/* 🔙 Back Navigation */}
      <nav className="workspace-nav">
        <button className="return-btn" onClick={() => window.history.back()}>
          ← Back to Workspace
        </button>
      </nav>

    </div>
  );
}

export default Workspace;
