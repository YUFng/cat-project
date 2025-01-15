import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import '../styles/UserProfile.css'; // Import the CSS file for styling

function UserProfile() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="user-profile">
            <h1>User Profile</h1>
            {user ? (
                <div>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Password:</strong> {user.password}</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <p>No user information available.</p>
            )}
        </div>
    );
}

export default UserProfile;