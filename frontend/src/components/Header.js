import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import '../styles/Header.css';

function Header() {
    const { user } = useContext(AuthContext);

    return (
        <header className="header">
            <nav className="navbar">
                <div className="logo">
                    <Link to="/">
                        <img src="/images/logo.png" alt="Website Logo" className="website-logo" />
                    </Link>
                </div>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    <li><Link to="/about-us">About Us</Link></li>
                    {user ? (
                        <li><Link to="/profile">Profile</Link></li>
                    ) : (
                        <li><Link to="/login">Login</Link></li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
