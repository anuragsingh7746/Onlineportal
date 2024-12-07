import React from "react";
import Timer from "./timer";
import "../styles/Sidepanel.css";

const SidePanel = ({ questions, currentQuestion, onQuestionChange, time, submithandle, isSubmitting }) => {
  return (
    <div className="side-panel">
      <Timer time={time} submithandle={submithandle} />
      <h3 className="side-panel-title">Questions</h3>
      <ul className="question-list">
        {questions.map((question, index) => (
          <li key={index}>
            <button
              className={index === currentQuestion ? "question-button active" : "question-button"}
              onClick={() => onQuestionChange(index)}
            >
              {`Question ${index + 1}`}
            </button>
          </li>
        ))}
      </ul>
      
      <div className="navigation-buttons">
        {currentQuestion < questions.length - 1 && (
          <button className="nav-button" onClick={() => onQuestionChange(currentQuestion + 1)}>Next</button>
        )}

        {currentQuestion > 0 && (
          <button className="nav-button" onClick={() => onQuestionChange(currentQuestion - 1)}>Prev</button>
        )}
      </div>
      
      <button 
        className="submit-button" 
        onClick={() => submithandle()} 
        disabled={isSubmitting} // Disable when submitting
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
};

export default SidePanel;
