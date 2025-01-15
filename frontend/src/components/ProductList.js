import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';
import '../styles/ProductList.css'; // Import the CSS file for styling

function ProductList() {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const navigate = useNavigate();

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

        if (user) {
            axios.get(`http://localhost:8080/cart?username=${user.username}`, { withCredentials: true })
                .then(response => setCart(response.data))
                .catch(error => {
                    console.error('Error fetching cart:', error);
                    setCart([]); // Ensure cart is an array even if fetching fails
                });
        }
    }, [user]);

    const handleAddToCart = (product) => {
        if (!user) {
            alert('Please log in to add items to your cart.');
            return;
        }

        axios.post('http://localhost:8080/cart', { username: user.username, ...product }, { withCredentials: true })
            .then(response => {
                console.log(response.data);
                setCart([...cart, product]);
            })
            .catch(error => console.error('Error adding product to cart:', error));
    };

    const handleRemoveFromCart = (productId) => {
        if (!user) {
            alert('Please log in to remove items from your cart.');
            return;
        }

        axios.delete(`http://localhost:8080/cart?username=${user.username}&productId=${productId}`, { withCredentials: true })
            .then(response => {
                console.log('Product removed:', response.data);
                setCart(cart.filter(item => item && item.id !== productId));
            })
            .catch(error => console.error('Error removing product:', error));
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const filteredProducts = products.filter(product => {
        return (
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory === '' || product.category === selectedCategory)
        );
    });

    const handleBuyNow = () => {
        navigate('/payment');
    };

    return (
        <div className="container">
            <h2>Product List</h2>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <div className="category-buttons">
                <button onClick={() => handleCategorySelect('')}>All</button>
                <button onClick={() => handleCategorySelect('rustic')}>Rustic</button>
                <button onClick={() => handleCategorySelect('elegant')}>Elegant</button>
                <button onClick={() => handleCategorySelect('custom')}>Custom</button>
            </div>
            <div className="product-grid">
                {filteredProducts && filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div key={product.id} className="product-card">
                            <h2>{product.name}</h2>
                            <p>Price: ${product.price}</p>
                            <p>Description: {product.description}</p>
                            <p>Category: {product.category}</p>
                            <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                        </div>
                    ))
                ) : (
                    <p>No products available.</p>
                )}
            </div>
            <h2>Shopping Cart</h2>
            <div className="product-grid">
                {cart.length === 0 ? (
                    <p>No products in the cart.</p>
                ) : (
                    cart.filter(item => item !== null).map(product => (
                        <div key={product.id} className="product-card">
                            <h2>{product.name}</h2>
                            <p>Price: ${product.price}</p>
                            <p>Description: {product.description}</p>
                            <p>Category: {product.category}</p>
                            <button onClick={() => handleRemoveFromCart(product.id)}>Remove</button>
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

export default ProductList;