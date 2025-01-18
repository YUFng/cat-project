import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../styles/UserProfile.css'; // Import the CSS file for styling

function UserProfile() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        axios.get(`http://localhost:8080/user/address?username=${user.username}`, { withCredentials: true })
            .then(response => {
                setAddress(response.data[user.username]);
            })
            .catch(error => console.error('Error fetching address:', error));
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAddressSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8080/user/address', { username: user.username, address }, { withCredentials: true })
            .then(response => {
                alert('Address saved successfully!');
            })
            .catch(error => {
                alert('Error saving address: ' + error.message);
            });
    };

    if (!user) {
        return null; // Render nothing if user is not authenticated
    }

    return (
        <div className="user-profile">
            <button onClick={() => navigate(-1)} className="back-button">Back</button>
            <h1>User Profile</h1>
            {user ? (
                <div>
                    <div className="input-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={user.username}
                            readOnly
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password:</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"} // Toggle input type
                                id="password"
                                name="password"
                                value={user.password}
                                readOnly
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle-icon"
                            />
                        </div>
                    </div>
                    <form onSubmit={handleAddressSubmit}>
                        <label htmlFor="address">Delivery Address:</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                        <button type="submit">Save Address</button>
                    </form>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                    <button onClick={() => navigate('/order-history')} className="order-history-button">View Order History</button>
                </div>
            ) : (
                <p>No user information available.</p>
            )}
        </div>
    );
}

export default UserProfile;