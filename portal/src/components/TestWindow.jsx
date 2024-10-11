import React, { useState, useEffect } from "react";
import SidePanel from "./SidePanel";
import QuestionDisplay from "./QuestionDisplay";
import {useParams} from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"; 

const TestWindow = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true); 
  const { testId } = useParams();
  const [time, settime] = useState(0);
  

  function handleSwitch(){
    if(document.visibilityState === "hidden"){
        alert(1);
    }
  }
  

  useEffect(() => {
    window.addEventListener('visibilitychange', handleSwitch);
    return () =>  {window.removeEventListener('visibilitychange', handleSwitch)}
  },[]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${API_URL}/api/test/${testId}/questions`); 
        const data = await response.json(); 
        setQuestions(data.questionIds); 
        setLoading(false); 
        settime(data.time*60*1000);
      } catch (error) {
        console.error("Error fetching questions:", error); 
      }
    };
    if(testId){
      fetchQuestions();
    }
    
  }, [testId]);

  const handleQuestionChange = (index) => {
      setCurrentQuestion(index);
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="test-window" id="test-window">
      
      <SidePanel
        questions={questions}
        currentQuestion={currentQuestion}
        onQuestionChange={handleQuestionChange}
        time = {time}
      />
    
      <QuestionDisplay
        question={questions[currentQuestion]}
        currentQuestion={currentQuestion}
        totalQuestions={questions.length}
      />
      
    </div>
  );
};

export default TestWindow;
