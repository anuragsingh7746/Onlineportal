import React, { useState } from "react";
import "../login.css";
import { useNavigate } from "react-router-dom";

const LoginWindow = ({onlogin}) => {
    const [Username, setUSername] = useState('');
    const [Password, setPassword] = useState('');
    const navigate = useNavigate();

    const handlelogin = (event) =>{
        event.preventDefault();
        if(Username === 'admin' && Password === 'password'){
            onlogin();
            navigate('/Dashboard');
        }
        else{
            alert('Invalid credentials');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handlelogin}>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        placeholder="Enter your username" 
                        value={Username}
                        onChange={(e) => setUSername(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        placeholder="Enter your password" 
                        value = {Password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="login-btn">
                    Login
                </button>
                </form>
            </div>
        </div>
    );
};

export default LoginWindow;