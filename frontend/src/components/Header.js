import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="header">
            <nav className="navbar">
                <div className="hamburger" onClick={toggleMenu}>
                    &#9776;
                </div>
                <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
                    <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
                    <li><Link to="/products" onClick={toggleMenu}>Products</Link></li>
                    <li><Link to="/about-us" onClick={toggleMenu}>About Us</Link></li>
                    <li><Link to="/event-planning-guide" onClick={toggleMenu}>Event Planning Guide</Link></li>
                    <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;