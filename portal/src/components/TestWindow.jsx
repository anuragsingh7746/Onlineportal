import React, { useState, useEffect } from "react";
import SidePanel from "./SidePanel";
import QuestionDisplay from "./QuestionDisplay";
import { useNavigate, useParams} from 'react-router-dom';
import DisableBackButton from "./DisableBackButton";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"; 

const TestWindow = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true); 
  const { testId } = useParams();
  const [time, setTime] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const navigate  = useNavigate();

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
        let storedDeadline = localStorage.getItem(`test_${testId}_deadline`);

        if (!storedDeadline) {
          const newDeadline = Date.now() + data.time * 60 * 1000; 
          localStorage.setItem(`test_${testId}_deadline`, newDeadline);
          setTime(newDeadline - Date.now());  
        } else {
          const remainingTime = storedDeadline - Date.now();
          if (remainingTime <= 0) {
            localStorage.removeItem(`test_${testId}_deadline`);
            navigate("/Dashboard"); 
          } else {
            setTime(remainingTime); 
          }
        }
        setSelectedOptions(Array(data.questionIds.length).fill(null));
      } catch (error) {
        console.error("Error fetching questions:", error); 
      }
    };
    if(testId){
      fetchQuestions();
    }
    
  }, [testId, navigate]);

  const handleQuestionChange = (index) => {
      setCurrentQuestion(index);
  };

  const submithandle = () =>{
      localStorage.removeItem(`test_${testId}_deadline`);
      navigate('/Dashboard');
  };

  const handleOptionChange = (questionIndex, option) => {
    const updatedOptions = [...selectedOptions];
    if(option === "unclear"){
      updatedOptions[questionIndex] = null;
    }
    else{
      updatedOptions[questionIndex] = option;
    }
    setSelectedOptions(updatedOptions);
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="test-window" id="test-window">
      <DisableBackButton/>  
      <SidePanel
        questions={questions}
        currentQuestion={currentQuestion}
        onQuestionChange={handleQuestionChange}
        time = {time}
        submithandle = {submithandle}
      />
    
      <QuestionDisplay
        question={questions[currentQuestion]}
        currentQuestion={currentQuestion}
        totalQuestions={questions.length}
        selectedOption={selectedOptions[currentQuestion]}
        onOptionChange={(option) => handleOptionChange(currentQuestion, option)}
      />
      
    </div>
  );
};

export default TestWindow;
