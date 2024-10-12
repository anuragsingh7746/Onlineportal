import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from "react-router-dom";


const Timer = ({ time, submithandle }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const navigate = useNavigate();
  const deadline = useMemo(() => Date.now() + time, [time]);

  const getTime = useCallback(() => {
    const currentTime = Date.now();
    const timeDifference = deadline - currentTime;

    if (timeDifference >0) {
      setHours(Math.floor((timeDifference / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((timeDifference / 1000 / 60) % 60));
      setSeconds(Math.floor((timeDifference / 1000) % 60));
    }

    else{
        submithandle();
        navigate('/Dashboard');
    }
  }, [deadline, navigate, submithandle]);

  useEffect(() => {
    const interval = setInterval(getTime, 1000);

    return () => clearInterval(interval);
  }, [getTime]);

  const timerContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',  
  };

  const boxStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    border: '2px solid #ddd',
    borderRadius: '5px',
    minWidth: '30px',
    backgroundColor: '#f0f0f0',  
  };

  const textStyle = {
    fontSize: '10px',
    color: '#555',
  };

  const timeStyle = {
    fontSize: '15px',
    fontWeight: 'bold',
    margin: 0,
  };

  return (
    <div style={timerContainerStyle}>
      <div style={boxStyle}>
        <p style={timeStyle}>{hours < 10 ? "0" + hours : hours}</p>
        <span style={textStyle}>Hours</span>
      </div>
      <div style={boxStyle}>
        <p style={timeStyle}>{minutes < 10 ? "0" + minutes : minutes}</p>
        <span style={textStyle}>Minutes</span>
      </div>
      <div style={boxStyle}>
        <p style={timeStyle}>{seconds < 10 ? "0" + seconds : seconds}</p>
        <span style={textStyle}>Seconds</span>
      </div>
    </div>
  );
};

export default Timer;
