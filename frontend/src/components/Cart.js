import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';
import '../styles/Cart.css'; // Import the CSS file for styling

function Cart() {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            axios.get('http://localhost:8080/cart', { withCredentials: true })
                .then(response => setCart(response.data))
                .catch(error => console.error('Error fetching cart:', error));
        }
    }, [user]);

    const handleRemove = (productId) => {
        if (user) {
            axios.delete(`http://localhost:8080/cart?productId=${productId}`, { withCredentials: true })
                .then(() => setCart(cart.filter(item => item.id !== productId)))
                .catch(error => console.error('Error removing product:', error));
        }
    };

    const handleBuyNow = () => {
        navigate('/payment');
    };

    const handleBackToProducts = () => {
        navigate('/products');
    };

    // Calculate total quantity and price
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + item.quantity * item.price, 0);

    return (
        <div className="cart-container">
            <h2 className="cart-title">Shopping Cart</h2>
            {cart.length === 0 ? (
                <div className="empty-cart">
                    <p className="empty-cart-message">Your cart is empty. Add some products to get started!</p>
                    <button onClick={handleBackToProducts} className="back-to-products-button">
                        Back to Products
                    </button>
                </div>
            ) : (
                <>
                    <div className="cart-summary">
                        <p>Total Items: <strong>{totalQuantity}</strong></p>
                        <p>Total Price: <strong>${totalPrice.toFixed(2)}</strong></p>
                    </div>
                    <div className="product-grid">
                        {cart.map(product => (
                            <div key={product.id} className="product-card">
                                <img src={product.image} alt={product.name} className="product-image" />
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-price">${product.price.toFixed(2)}</p>
                                <p className="product-quantity">Quantity: {product.quantity}</p>
                                <p className="product-subtotal">Subtotal: ${(product.quantity * product.price).toFixed(2)}</p>
                                <button 
                                    onClick={() => handleRemove(product.id)} 
                                    className="remove-button">
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="cart-actions">
                        <button onClick={handleBuyNow} className="buy-now-button">Proceed to Checkout</button>
                        <button onClick={handleBackToProducts} className="back-to-products-button">
                            Back to Products
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;