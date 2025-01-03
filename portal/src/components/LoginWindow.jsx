import React, { useState } from "react";
import "../login.css";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const LoginWindow = ({onlogin}) => {
    const [Username, setUSername] = useState('');
    const [Password, setPassword] = useState('');
    const navigate = useNavigate();

    const handlelogin = async (event) =>{
        event.preventDefault();
        try{
            const response = await fetch(`${API_URL}/api/login`,{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({
                    username : Username,
                    password : Password,
                }),
            });

            const data = await response.json();

            if(!response.ok){
                alert(data.message);
            }
            else{
                onlogin();
                localStorage.setItem(`username`,Username);
                navigate('/Dashboard');
            }

        }catch(error){
            console.error('Error logging in:', error);
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
