import React, { useState, useEffect, useCallback } from "react";
import SidePanel from "./SidePanel";
import QuestionDisplay from "./QuestionDisplay";
import { useNavigate, useParams } from 'react-router-dom';
import DisableBackButton from "./DisableBackButton";
import "../styles/Testwindow.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"; 

const TestWindow = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true); 
  const { testId } = useParams();
  const [time, setTime] = useState(0); // Set default time if no time is provided
  const [selectedOptions, setSelectedOptions] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userid'); 

  const logactivity = useCallback((action) => {
    const logs = JSON.parse(localStorage.getItem(`test_${testId}_logs`)) || [];
    const timestamp = new Date().toISOString();
    const entry = { action, timestamp };
    logs.push(entry);
    localStorage.setItem(`test_${testId}_logs`, JSON.stringify(logs)); 
  }, [testId]);

  useEffect(() => {
    const handleSwitch = () => {
      if (document.visibilityState === "hidden") {
        logactivity(`Tab Switched`);
      }
    };

    window.addEventListener('visibilitychange', handleSwitch);
    return () => {
      window.removeEventListener('visibilitychange', handleSwitch);
    };
  }, [logactivity]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${API_URL}/api/take_test`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            userId: userId,
            testId: testId,
          }),
        });
        const data = await response.json(); 
        console.log(data);
        
        // Set questions based on the new response structure
        setQuestions(data.questions); 
        setLoading(false); 

        // Initialize timer - example default time of 30 minutes
        let storedDeadline = localStorage.getItem(`test_${testId}_deadline`);
        if (!storedDeadline) {
          const newDeadline = Date.now() + data.duration * 60 * 1000; 
          localStorage.setItem(`test_${testId}_deadline`, newDeadline);
          console.log(newDeadline);
          console.log(Date.now());
          setTime(data.duration*60*1000);  
        } else {
          const remainingTime = storedDeadline - Date.now();
          if (remainingTime <= 0) {
            localStorage.removeItem(`test_${testId}_deadline`);
            navigate("/Dashboard"); 
          } else {
            setTime(remainingTime); 
          }
        }

        // Initialize selected options based on the number of questions
        const storedOptions = localStorage.getItem(`test_${testId}_selectedOptions`);
        if (!storedOptions) {
          setSelectedOptions(Array(data.questions.length).fill(null));
        } else {
          setSelectedOptions(JSON.parse(storedOptions));
        }

        const started = localStorage.getItem(`test_${testId}_teststarted`);
        if (!started) {
          const currtime = Date.now();
          localStorage.setItem(`test_${testId}_teststarted`, currtime);
          logactivity(`Test Started`);
        }

      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    if (testId) {
      fetchQuestions();
    }
  }, [testId, navigate, logactivity, userId]);

  const handleQuestionChange = (index) => {
    setCurrentQuestion(index);
    logactivity(`Selected question ${index}`);
  };

  const submithandle = async () => {
    logactivity(`Submitted Test`);
    // try {
    //   const logs = JSON.parse(localStorage.getItem(`test_${testId}_logs`)) || [];
    //   const username = localStorage.getItem('username');

    //   const data = {
    //     username,
    //     logs,
    //   };

    //   const response = await fetch(`${API_URL}/api/testlog/${testId}/logs`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data),
    //   });

    //   if (!response.ok) {
    //     throw new Error('Failed to send logs to the backend');
    //   }

      localStorage.removeItem(`test_${testId}_deadline`);
      localStorage.removeItem(`test_${testId}_selectedOptions`);
      localStorage.removeItem(`test_${testId}_logs`);
      localStorage.removeItem(`test_${testId}_teststarted`);

    //   setQuestions([]);
    //   setSelectedOptions([]);
    //   setTime(0);
    //   setCurrentQuestion(0);

    //   navigate('/Dashboard');
      
    // } catch (error) {
    //   console.error("Error during submission:", error);
    // }
  };

  const handleOptionChange = (questionIndex, option) => {
    const updatedOptions = [...selectedOptions];
    if (option === "unclear") {
      updatedOptions[questionIndex] = null;
      logactivity(`Cleared option for question ${questionIndex}`);
    } else {
      updatedOptions[questionIndex] = option;
      logactivity(`Selected option ${option} for question ${questionIndex}`);
    }
    setSelectedOptions(updatedOptions);
    localStorage.setItem(`test_${testId}_selectedOptions`, JSON.stringify(updatedOptions));
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="test-window" id="test-window">
      <DisableBackButton />  
      <SidePanel
        questions={questions}
        currentQuestion={currentQuestion}
        onQuestionChange={handleQuestionChange}
        time={time}
        submithandle={submithandle}
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
