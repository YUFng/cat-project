import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Cart() {
    const [cart, setCart] = useState(['1', '2', '3']); // Mock data for testing

    useEffect(() => {
        axios.get('http://localhost:8080/cart', { withCredentials: true })
            .then(response => {
                console.log('Cart data fetched:', response.data); // Debugging log
                setCart(response.data);
            })
            .catch(error => console.error('Error fetching cart:', error));
    }, []);

    const handleRemove = (productId) => {
        axios.delete(`http://localhost:8080/cart?productId=${productId}`, { withCredentials: true })
            .then(response => {
                console.log('Product removed:', response.data); // Debugging log
                setCart(cart.filter(item => item !== productId));
            })
            .catch(error => console.error('Error removing product:', error));
    };

    return (
        <div>
            <h2>Shopping Cart</h2>
            <div>
                {cart.length === 0 ? (
                    <p>No products in the cart.</p>
                ) : (
                    cart.map(productId => (
                        <div key={productId}>
                            Product ID: {productId}
                            <button onClick={() => handleRemove(productId)}>Remove</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Cart;