import React from "react";
import "../styles/Questiondisplay.css"; // Import the external CSS

const QuestionDisplay = ({ question, currentQuestion, totalQuestions, selectedOption, onOptionChange }) => {
  return (
    <div className="question-display">
      <h2>{`Question ${currentQuestion + 1} of ${totalQuestions}`}</h2>
      <p className="question-text">{question.question_text}</p>
      <div className="options">
        {question.options.map((option, index) => (
          <div key={index} className="option">
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
      <button className="unclear-button" onClick={() => onOptionChange("unclear")}>Unclear</button>
    </div>
  );
};

export default QuestionDisplay;
