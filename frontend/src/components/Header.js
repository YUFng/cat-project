import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import '../styles/Header.css';

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const navRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (navRef.current && !navRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <header className="header">
            <nav className="navbar" ref={navRef}>
                <div className="logo">
                    <Link to="/">
                        <img src="/images/logo.png" alt="Website Logo" className="website-logo" />
                    </Link>
                </div>
                <div className="hamburger" onClick={toggleMenu}>
                    &#9776;
                </div>
                <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
                    <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
                    <li><Link to="/products" onClick={toggleMenu}>Products</Link></li>
                    <li><Link to="/about-us" onClick={toggleMenu}>About Us</Link></li>
                    {user ? (
                        <li><Link to="/profile" onClick={toggleMenu}>Profile</Link></li>
                    ) : (
                        <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;