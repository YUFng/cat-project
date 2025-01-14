import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import ProductList from './components/ProductList';
import Admin from './components/Admin';
import AboutUs from './components/AboutUs';
import EventPlanningGuide from './components/EventPlanningGuide';
import Header from './components/Header';

function App() {
    return (
        <Router>
            <Header />
            <div>
                <h1>Welcome to the Wedding E-Commerce Website</h1>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/event-planning-guide" element={<EventPlanningGuide />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;