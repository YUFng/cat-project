import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css'; // Import the CSS file for styling

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8080/user/login', { username, password })
            .then(response => {
                const data = response.data;
                setMessage(data.message);
                if (data.userType === 'admin') {
                    window.location.href = '/admin';
                } else if (data.userType === 'user') {
                    window.location.href = '/';
                } else {
                    setMessage('Authentication failed');
                }
            })
            .catch(error => setMessage('Error: ' + error.message));
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
            <div className="auth-buttons">
                <button onClick={() => navigate('/signup')}>Sign Up</button>
            </div>
        </div>
    );
}

export default Login;