import "./TimerLengthControl.css";

const TimerLengthControl = (props) => {
  return (
    <div id="timer-length-container">
      <div id={props.id}>{props.text}</div>

      <div id="timer-length-innerContainer">
        <button
          id={props.decId}
          value="-"
          onClick={props.onClick}
          disabled={props.disable}
        >
          <i className="fa fa-arrow-down fa-2x" />
        </button>

        <div id={props.lengthId}>{props.length}</div>

        <button
          id={props.incId}
          value="+"
          onClick={props.onClick}
          disabled={props.disable}
        >
          <i className="fa fa-arrow-up fa-2x" />
        </button>
      </div>
    </div>
  );
};

export default TimerLengthControl;
