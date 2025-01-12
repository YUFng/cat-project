import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Cart() {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/cart')
            .then(response => setCart(response.data))
            .catch(error => console.error('Error fetching cart:', error));
    }, []);

    const handleRemove = (productId) => {
        axios.delete(`http://localhost:8080/cart?productId=${productId}`)
            .then(response => {
                console.log(response.data);
                setCart(cart.filter(item => item !== productId));
            })
            .catch(error => console.error('Error removing product:', error));
    };

    return (
        <div>
            <h2>Shopping Cart</h2>
            <ul>
                {cart.map(productId => (
                    <li key={productId}>
                        Product ID: {productId}
                        <button onClick={() => handleRemove(productId)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Cart;