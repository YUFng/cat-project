import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ProductList from './components/ProductList';
import Admin from './components/Admin';
import AboutUs from './components/AboutUs';
import Header from './components/Header';
import UserProfile from './components/UserProfile';
import Cart from './components/Cart';
import Payment from './components/Payment';
import OrderHistory from './components/OrderHistory';
import { AuthProvider } from './components/AuthContext';
import './styles.css'; // Import the CSS file for styling

function App() {
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleBackToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AuthProvider>
            <Router>
                <Header />
                <div className="container">
                    <h1>Welcome to the EverAfter Creations</h1>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/products/*" element={<ProductList />} />
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/order-history" element={<OrderHistory />} />
                    </Routes>
                </div>
                {showBackToTop && (
                    <button onClick={handleBackToTop} className="back-to-top-button">↑</button>
                )}
                
                <footer className="footer">
                    <div className="footer-container">
                        <div className="footer-about">
                            <div className="footer-logo">
                                <img src="/images/logo.png" alt="Wedding E-Commerce Logo" className="website-logo"/>
                            </div>
                            <h2>About Us</h2>
                            <p>
                                "EverAfter Creations" is your ultimate destination for all your wedding needs.
                                From wedding attire to decorations, we provide everything to make your special day unforgettable.
                            </p>
                        </div>

                        {/* Contact Us Section */}
                        <div className="footer-contact">
                            <h2>Contact Us</h2>
                            <div className="contact-buttons">
                                <a
                                    href="https://www.facebook.com/share/155fzxVVqE/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="contact-button facebook-button"
                                >
                                    <i className="fab fa-facebook"></i> Facebook
                                </a>
                                <a
                                    href="https://www.instagram.com/penang.visit?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="contact-button instagram-button"
                                >
                                    <i className="fab fa-instagram"></i> Instagram
                                </a>
                                <a
                                    href="mailto:info@weddingecommerce.com"
                                    className="contact-button email-button"
                                >
                                    <i className="fas fa-envelope"></i> Email Us
                                </a>
                            </div>
                        </div>
                        <div className="footer-nav">
                            <h2>Quick Links</h2>
                            <nav className="footer-buttons">
                                <a href="/" className="footer-button">Home</a>
                                <a href="/products" className="footer-button">Products</a>
                                <a href="/about-us" className="footer-button">About Us</a>
                                <a href="/login" className="footer-button">Login</a>
                            </nav>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        © 2025 EverAfter Creations. All rights reserved.
                    </div>
                </footer>
            </Router>
        </AuthProvider>
    );
}

export default App;