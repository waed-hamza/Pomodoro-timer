import { useState, useRef, useEffect } from "react";
import "./App.css";
import TimerLengthControl from "./TimerLengthControl";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timer, setTimer] = useState(1500);
  const [timerType, setTimerType] = useState("Session");
  const [intervalID, setIntervalID] = useState("");
  const [play, setPlay] = useState(false);
  const [alarmColor, setAlarmColor] = useState({ color: "rgb(58, 58, 58)" });
  const audioBeep = useRef();

  const interval = () => {
    let timeOut, cancel;

    timeOut = setTimeout(() => {
      if (timer && play) {
        setTimer(timer - 1);
      }
    }, 1000);

    cancel = () => {
      return clearTimeout(timeOut);
    };

    return {
      cancel: cancel,
    };
  };

  const handleBreakLength = (e) => {
    const sign = e.currentTarget.value;

    if (sign === "-" && breakLength !== 1) {
      setBreakLength(breakLength - 1);
      if (timerType === "Break") {
        setTimer(timer - 60);
      }
    } else if (sign === "+" && breakLength !== 60) {
      setBreakLength(breakLength + 1);
      if (timerType === "Break") {
        setTimer(timer + 60);
      }
    }
  };

  const handleSessionLength = (e) => {
    const sign = e.currentTarget.value;

    if (sign === "-" && sessionLength !== 1) {
      setSessionLength(sessionLength - 1);
      if (timerType === "Session") {
        setTimer(timer - 60);
      }
    } else if (sign === "+" && sessionLength !== 60) {
      setSessionLength(sessionLength + 1);
      if (timerType === "Session") {
        setTimer(timer + 60);
      }
    }
  };

  const clockify = () => {
    let minutes = Math.floor(timer / 60);
    let seconds = timer - minutes * 60;

    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${minutes}:${seconds}`;
  };

  const handlePlay = () => {
    setPlay(!play);
  };

  const resetTimer = () => {
    if (!timer && timerType === "Session") {
      setTimer(breakLength * 60);
      setTimerType("Break");
    }

    if (!timer && timerType === "Break") {
      setTimer(sessionLength * 60);
      setTimerType("Session");
    }
  };

  const controlTimer = () => {
    if (play) {
      setIntervalID(interval);
      warning(timer);
      buzzer(timer);
      resetTimer();
    } else if (intervalID) {
      intervalID.cancel();
    }
  };

  useEffect(() => {
    controlTimer();
  }, [timer, play]);

  const warning = (_timer) => {
    if (_timer < 60) {
      setAlarmColor({ color: "#a50d0d" });
    } else {
      setAlarmColor({ color: "rgb(58, 58, 58)" });
    }
  };

  const buzzer = (_timer) => {
    if (_timer === 0) {
      audioBeep.current.play();
    }
  };

  const reset = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTimer(1500);
    setTimerType("Session");
    setAlarmColor({ color: "rgb(58, 58, 58)" });
    setPlay(false);
    setIntervalID("");

    if (intervalID) {
      intervalID.cancel();
    }

    audioBeep.current.pause();
    audioBeep.current.currentTime = 0;
  };

  return (
    <div className="App">
      <h1>Pomodoro Timer</h1>

      <div id="timer-control-container">
        <TimerLengthControl
          id="break-label"
          text="Break Length"
          length={breakLength}
          lengthId="break-length"
          incId="break-increment"
          decId="break-decrement"
          disable={play}
          onClick={handleBreakLength}
        />
        <TimerLengthControl
          id="session-label"
          text="Session Length"
          length={sessionLength}
          lengthId="session-length"
          incId="session-increment"
          decId="session-decrement"
          disable={play}
          onClick={handleSessionLength}
        />
      </div>

      <div id="timer-container" style={alarmColor}>
        <div id="timer-label">{timerType}</div>

        <div id="time-left">{clockify()}</div>

        <div id="buttons-container">
          <button id="start-stop" onClick={handlePlay} style={alarmColor}>
            <i className="fa fa-play fa-2x" />
            <i className="fa fa-pause fa-2x" />
          </button>

          <button id="reset" onClick={reset} style={alarmColor}>
            <i className="fa fa-refresh fa-2x" />
          </button>
        </div>
      </div>

      <audio
        id="beep"
        preload="auto"
        ref={audioBeep}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
}

export default App;
