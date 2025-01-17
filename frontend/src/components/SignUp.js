import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SignUp.css'; // Import the CSS file for styling

function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const userType = 'user'; // Set userType to 'user'
        axios.post('http://localhost:8080/user/signup', { username, password, userType })
            .then(response => {
                setMessage('Account created successfully!');
            })
            .catch(error => setMessage('Error: ' + error.message));
    };

    return (
        <div className="signup-container">
            <h1>Sign Up</h1>
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
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label>
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    Show Password
                </label>
                <input
                    type="hidden"
                    id="userType"
                    name="userType"
                    value="user"
                />
                <button type="submit">Sign Up</button>
            </form>
            {message && <p>{message}</p>}
            <div className="auth-buttons">
                <p>Already have an account?</p>
                <button onClick={() => navigate('/login')}>Log In</button>
            </div>
        </div>
    );
}

export default SignUp;