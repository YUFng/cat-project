import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ProductList from './components/ProductList';
import Admin from './components/Admin';
import AboutUs from './components/AboutUs';
import EventPlanningGuide from './components/EventPlanningGuide';
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
                    <h1>Welcome to the Wedding E-Commerce Website</h1>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/products/*" element={<ProductList />} />
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route path="/event-planning-guide" element={<EventPlanningGuide />} />
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
                    © 2025 Wedding E-Commerce. All rights reserved.
                </footer>
            </Router>
        </AuthProvider>
    );
}

export default App;