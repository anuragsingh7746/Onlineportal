import './App.css';
import LoginWindow from './components/LoginWindow';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import TestWindow from './components/TestWindow';

function App() {
  const [IsAuthenticated, SetIsAuthenticated] = useState(false);
  const handlelogin = () =>{
    SetIsAuthenticated(true);
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element = {<LoginWindow onlogin = {handlelogin}/>}/>
        <Route path="/Dashboard" element = {IsAuthenticated ? <Dashboard/> : <Navigate to="/"/>}/>
        <Route path="/TestWindow/:testId" element = {<TestWindow/>}/>
      </Routes>
    </Router>
  );
}

export default App;
