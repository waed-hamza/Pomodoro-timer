import { useState, useRef, useEffect } from "react";
import "./App.css";
import TimerLengthControl from "./TimerLengthControl";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timer, setTimer] = useState(1500);
  const [timerState, setTimerState] = useState("stopped");
  const [timerType, setTimerType] = useState("Session");
  const [intervalID, setIntervalID] = useState("");
  const [alarmColor, setAlarmColor] = useState({ color: "rgb(58, 58, 58)" });
  const audioBeep = useRef();

  const accurateInterval = function (fn, time) {
    let cancel, nextAt, wrapper, timeout;

    nextAt = new Date().getTime() + time;
    timeout = null;

    wrapper = function () {
      nextAt += time;
      timeout = setTimeout(wrapper, nextAt - new Date().getTime());
      return fn();
    };

    cancel = function () {
      return clearTimeout(timeout);
    };

    timeout = setTimeout(wrapper, nextAt - new Date().getTime());

    return {
      cancel: cancel,
    };
  };

  const handleBreakLength = (e) => {
    lengthControl("breakLength", e.currentTarget.value, breakLength, "Session");
  };

  const handleSessionLength = (e) => {
    lengthControl(
      "sessionLength",
      e.currentTarget.value,
      sessionLength,
      "Break"
    );
  };

  const lengthControl = (stateToChange, sign, currentLength, timeType) => {
    if (timerState === "running") {
      return;
    }

    if (timerType === timeType) {
      if (sign === "-" && currentLength !== 1) {
        stateToChange === "breakLength"
          ? setBreakLength(currentLength - 1)
          : setSessionLength(currentLength - 1);
      } else if (sign === "+" && currentLength !== 60) {
        stateToChange === "breakLength"
          ? setBreakLength(currentLength + 1)
          : setSessionLength(currentLength + 1);
      }
    } else if (sign === "-" && currentLength !== 1) {
      stateToChange === "breakLength"
        ? setBreakLength(currentLength - 1)
        : setSessionLength(currentLength - 1);
      setTimer(currentLength * 60 - 60);
    } else if (sign === "+" && currentLength !== 60) {
      stateToChange === "breakLength"
        ? setBreakLength(currentLength + 1)
        : setSessionLength(currentLength + 1);
      setTimer(currentLength * 60 + 60);
    }
  };

  const clockify = () => {
    let minutes = Math.floor(timer / 60);
    let seconds = timer - minutes * 60;

    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${minutes}:${seconds}`;
  };

  const timerControl = () => {
    if (timerState === "stopped") {
      beginCountDown();
      setTimerState("running");
    } else {
      setTimerState("stopped");
      if (intervalID) {
        intervalID.cancel();
      }
    }
  };

  const beginCountDown = () => {
    setIntervalID(
      accurateInterval(() => {
        decrementTimer();
      }, 1000)
    );
  };

  const decrementTimer = () => {
    setTimer((prev) => prev - 1);
  };

  useEffect(() => {
    warning(timer);
    buzzer(timer);

    if (timer < 0) {
      if (intervalID) {
        intervalID.cancel();
      }

      if (timerType === "Session") {
        beginCountDown();
        switchTimer(breakLength * 60, "Break");
      } else {
        beginCountDown();
        switchTimer(sessionLength * 60, "Session");
      }
    }
  }, [timer]);

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

  const switchTimer = (num, str) => {
    setTimer(num);
    setTimerType(str);
    // setAlarmColor({ color: 'white' });
  };

  const reset = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTimer(1500);
    setTimerState("stopped");
    setTimerType("Session");
    setIntervalID("");
    setAlarmColor({ color: "rgb(58, 58, 58)" });

    if (intervalID) {
      intervalID.cancel();
    }

    audioBeep.current.pause();
    audioBeep.current.currentTime = 0;
  };

  return (
    <div className="App">
      <h1>25 + 5 Clock</h1>

      <div id="timer-control-container">
        <TimerLengthControl
          id="break-label"
          text="Break Length"
          length={breakLength}
          lengthId="break-length"
          incId="break-increment"
          decId="break-decrement"
          onClick={handleBreakLength}
        />
        <TimerLengthControl
          id="session-label"
          text="Session Length"
          length={sessionLength}
          lengthId="session-length"
          incId="session-increment"
          decId="session-decrement"
          onClick={handleSessionLength}
        />
      </div>

      <div id="timer-container" style={alarmColor}>
        <div id="timer-label">{timerType}</div>

        <div id="time-left">{clockify()}</div>

        <div id="buttons-container">
          <button id="start-stop" onClick={timerControl} style={alarmColor}>
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
