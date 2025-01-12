import React from 'react';
import Login from './components/Login';
import ProductList from './components/ProductList';
import Cart from './components/Cart';

function App() {    
    return (
        <div>
            <h1>Welcome to the E-Commerce Website</h1>
            <Login />
            <ProductList />
            <Cart />
        </div>
    );
}

export default App;