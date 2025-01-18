import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';
import '../styles/ProductList.css';

function ProductList() {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [cartSummary, setCartSummary] = useState({ totalQuantity: 0, totalPrice: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [quantities, setQuantities] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        if (user) {
            axios.get('http://localhost:8080/cart', { withCredentials: true })
                .then(response => {
                    setCart(response.data);
                    calculateCartSummary(response.data);
                })
                .catch(() => setCart([]));
        }
    }, [user]);

    const fetchProducts = () => {
        axios.get('http://localhost:8080/products', { withCredentials: true })
            .then(response => setProducts(response.data))
            .catch(() => setProducts([]));
    };

    const calculateCartSummary = (cartItems) => {
        const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setCartSummary({ totalQuantity, totalPrice });
    };

    const handleQuantityChange = (productId, quantity) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: quantity,
        }));
    };

    const handleAddToCart = (product) => {
        const quantity = quantities[product.id] || 1;

        if (!user) {
            alert('Please log in to add items to your cart.');
            return;
        }

        if (quantity > product.inventory) {
            alert('The quantity exceeds the available inventory.');
            return;
        }

        axios.post('http://localhost:8080/cart', { product, quantity }, { withCredentials: true })
            .then(() => {
                const updatedCart = [...cart, { ...product, quantity }];
                setCart(updatedCart);
                calculateCartSummary(updatedCart);
                setProducts(products.map(p => p.id === product.id ? { ...p, inventory: p.inventory - quantity } : p));
            })
            .catch(() => alert('Failed to add the product to the cart.'));
    };

    const handleViewCart = () => {
        navigate('/cart');
    };

    const filteredProducts = products.filter(product => {
        return (
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory === '' || product.category === selectedCategory)
        );
    });

    return (
        <div className="container">
            <h2>Product List</h2>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="category-buttons">
                <button onClick={() => setSelectedCategory('')} className="category-button">All</button>
                <button onClick={() => setSelectedCategory('rustic')} className="category-button">Rustic</button>
                <button onClick={() => setSelectedCategory('elegant')} className="category-button">Elegant</button>
                <button onClick={() => setSelectedCategory('custom')} className="category-button">Custom</button>
            </div>
            <div className="product-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div key={product.id} className="product-card">
                            <img src={product.image} alt={product.name} className="product-image" />
                            <h2>{product.name}</h2>
                            <p>Price: ${product.price.toFixed(2)}</p>
                            <p>Category: {product.category}</p>
                            <p>Inventory: {product.inventory}</p>
                            <input
                                type="number"
                                min="1"
                                max={product.inventory}
                                value={quantities[product.id] || 1}
                                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                                className="quantity-input"
                            />
                            <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                        </div>
                    ))
                ) : (
                    <p>No products available.</p>
                )}
            </div>
            <div className="cart-summary">
                <p>Total Items: {cartSummary.totalQuantity}</p>
                <p>Total Price: ${cartSummary.totalPrice.toFixed(2)}</p>
                <button onClick={handleViewCart} className="view-cart-button">View Cart</button>
            </div>
        </div>
    );
}

export default ProductList;
