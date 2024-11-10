import React, { useState } from "react";
import "../login.css";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"; 

const LoginWindow = ({ onlogin }) => {
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: Username,
                    password: Password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
            } else {
                const user = data.data;

                // Store individual properties from the array response
                localStorage.setItem('userid', user[0]); // User ID
                localStorage.setItem('username', user[1]); // Username
                localStorage.setItem('role', user[2]); // Role (can be null or 'admin')
                localStorage.setItem('registered_tests', JSON.stringify(user[3])); // Registered tests array
                localStorage.setItem('given_tests', JSON.stringify(user[4])); // Given tests array

                // Navigate based on role
                if (user[2] === 'admin') {
                    navigate('/AdminDashboard');
                } else {
                    navigate('/Dashboard');
                }

                onlogin(); 
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            value={Username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={Password}
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
