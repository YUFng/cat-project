import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/products', { withCredentials: true })
            .then(response => {
                console.log('Products fetched:', response.data); // Debugging log
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setProducts([]); // Ensure products is an array even if fetching fails
            });

        axios.get('http://localhost:8080/cart', { withCredentials: true })
            .then(response => setCart(response.data))
            .catch(error => {
                console.error('Error fetching cart:', error);
                setCart([]); // Ensure cart is an array even if fetching fails
            });
    }, []);

    const handleAddToCart = (productId) => {
        axios.post(`http://localhost:8080/cart?productId=${productId}`, {}, { withCredentials: true })
            .then(response => {
                console.log(response.data);
                setCart([...cart, productId]);
            })
            .catch(error => console.error('Error adding product to cart:', error));
    };

    const handleRemoveFromCart = (productId) => {
        axios.delete(`http://localhost:8080/cart?productId=${productId}`, { withCredentials: true })
            .then(response => {
                console.log('Product removed:', response.data);
                setCart(cart.filter(item => item !== productId));
            })
            .catch(error => console.error('Error removing product:', error));
    };

    return (
        <div>
            <h2>Product List</h2>
            <div>
                {products && products.length > 0 ? (
                    products.map(product => (
                        <div key={product.id}>
                            <h2>{product.name}</h2>
                            <p>Price: ${product.price}</p>
                            <p>Description: {product.description}</p>
                            <p>Category: {product.category}</p>
                            <button onClick={() => handleAddToCart(product.id)}>Add to Cart</button>
                        </div>
                    ))
                ) : (
                    <p>No products available.</p>
                )}
            </div>
            <h2>Shopping Cart</h2>
            <div>
                {cart.length === 0 ? (
                    <p>No products in the cart.</p>
                ) : (
                    cart.map(productId => (
                        <div key={productId}>
                            Product ID: {productId}
                            <button onClick={() => handleRemoveFromCart(productId)}>Remove</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ProductList;