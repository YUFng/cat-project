import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Admin from './components/Admin';
import User from './components/User';

function App() {
    return (
        <Router>
            <div>
                <h1>Welcome to the Wedding E-Commerce Website</h1>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/user" element={<User />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/cart" element={<Cart />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;