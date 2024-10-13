// QuestionDisplay.jsx
import React from "react";

const QuestionDisplay = ({ question, currentQuestion, totalQuestions, selectedOption, onOptionChange }) => {

  return (
    <div className="question-display">
      <h2>{`Question ${currentQuestion + 1} of ${totalQuestions}`}</h2>
      <p>{question.text}</p>
      <div className="options">
        {question.options.map((option, index) => (
          <div key={index}>
            <label>
              <input
                type="radio"
                value={option}
                checked={selectedOption === option}
                onChange={() => onOptionChange(option)}
              />
              {option}
            </label>
          </div>
        ))}
      </div>
      <button onClick={() => onOptionChange("inclear")}>Unclear</button>
    </div>
  );
};

export default QuestionDisplay;
