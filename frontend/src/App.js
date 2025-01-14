import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ProductList from './components/ProductList';
import Admin from './components/Admin';
import AboutUs from './components/AboutUs';
import EventPlanningGuide from './components/EventPlanningGuide';
import Header from './components/Header';
import './styles.css'; // Import the CSS file for styling

function App() {
    return (
        <Router>
            <Header />
            <div className="container">
                <h1>Welcome to the Wedding E-Commerce Website</h1>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/event-planning-guide" element={<EventPlanningGuide />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </div>
            <footer className="footer">
                © 2025 Wedding E-Commerce. All rights reserved.
            </footer>
        </Router>
    );
}

export default App;