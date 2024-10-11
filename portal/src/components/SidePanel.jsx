// SidePanel.jsx
import React from "react";
import Timer from "./timer";

const SidePanel = ({ questions, currentQuestion, onQuestionChange, time }) => {
  return (
    <div className="side-panel">
      <Timer time= {time} />
      <h3>Questions</h3>
      <ul>
        {questions.map((question, index) => (
          <li key={index}>
            <button
              className={index === currentQuestion ? "active" : ""}
              onClick={() => onQuestionChange(index)}
            >
              {`Question ${index + 1}`}
            </button>
          </li>
        ))}
      </ul>
      {currentQuestion>=0 && currentQuestion<questions.length -1 ? <button onClick={ () => onQuestionChange(currentQuestion+1)}>Next</button> :  <button></button>}
      {currentQuestion>0 && currentQuestion<questions.length ? <button onClick={ () => onQuestionChange(currentQuestion-1)}>Prev</button> :  <button></button>}
      
      
    </div>
  );
};

export default SidePanel;
