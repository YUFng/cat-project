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
                .then(response => {
                    console.log('Cart data fetched:', response.data); // Debugging log
                    setCart(response.data);
                })
                .catch(error => console.error('Error fetching cart:', error));
        }
    }, [user]);

    const handleRemove = (productId) => {
        if (user) {
            axios.delete(`http://localhost:8080/cart?productId=${productId}`, { withCredentials: true })
                .then(response => {
                    console.log('Product removed:', response.data); // Debugging log
                    setCart(cart.filter(item => item.id !== productId));
                })
                .catch(error => console.error('Error removing product:', error));
        }
    };

    const handleBuyNow = () => {
        navigate('/payment');
    };

    return (
        <div>
            <h2>Shopping Cart</h2>
            <div className="product-grid">
                {cart.length === 0 ? (
                    <p>No products in the cart.</p>
                ) : (
                    cart.map(product => (
                        <div key={product.id} className="product-card">
                            <img src={product.image} alt={product.name} className="product-image" />
                            <h2>{product.name}</h2>
                            <p>Price: ${product.price}</p>
                            <p>Description: {product.description}</p>
                            <p>Category: {product.category}</p>
                            <button onClick={() => handleRemove(product.id)}>Remove</button>
                        </div>
                    ))
                )}
            </div>
            {cart.length > 0 && (
                <button onClick={handleBuyNow} className="buy-now-button">Buy Now</button>
            )}
        </div>
    );
}

export default Cart;