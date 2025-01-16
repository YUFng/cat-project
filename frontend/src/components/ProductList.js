import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';
import Payment from './Payment';
import '../styles/ProductList.css'; // Import the CSS file for styling

function ProductList() {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        // Fetch cart if user is logged in
        if (user) {
            axios.get('http://localhost:8080/cart', { withCredentials: true })
                .then(response => {
                    console.log('Cart fetched:', response.data); // Debugging log
                    setCart(response.data);
                })
                .catch(error => {
                    console.error('Error fetching cart:', error);
                    setCart([]); // Ensure cart is an array even if fetching fails
                });
        }

        // Listen for the custom event to update products
        const updateProductsListener = () => {
            fetchProducts();
        };
        window.addEventListener('updateProducts', updateProductsListener);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('updateProducts', updateProductsListener);
        };
    }, [user]);

    const fetchProducts = () => {
        // Fetch products
        axios.get('http://localhost:8080/products', { withCredentials: true })
            .then(response => {
                console.log('Products fetched:', response.data); // Debugging log
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setProducts([]); // Ensure products is an array even if fetching fails
            });
    };

    const handleAddToCart = (product) => {
        if (!user) {
            alert('Please log in to add items to your cart.');
            return;
        }

        if (product.inventory <= 0) {
            alert('This product is out of stock.');
            return;
        }
    
        axios.post('http://localhost:8080/cart', { product }, { withCredentials: true })
            .then(response => {
                console.log(response.data);
                setCart([...cart, { ...product, cartItemId: `${product.id}-${Date.now()}` }]);
                setProducts(products.map(p => p.id === product.id ? { ...p, inventory: p.inventory - 1 } : p));
            })
            .catch(error => {
                console.error('Error adding product to cart:', error);
                if (error.response) {
                    console.error('Error response data:', error.response.data);
                }
            });
    };

    const handleRemoveFromCart = (cartItemId) => {
        if (!user) {
            alert('Please log in to remove items from your cart.');
            return;
        }

        const productId = cart.find(item => item.cartItemId === cartItemId).id;

        axios.delete(`http://localhost:8080/cart?productId=${productId}`, { withCredentials: true })
            .then(response => {
                console.log('Product removed:', response.data);
                setCart(cart.filter(item => item.cartItemId !== cartItemId));
                setProducts(products.map(p => p.id === productId ? { ...p, inventory: p.inventory + 1 } : p));
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
                    filteredProducts.map((product, index) => (
                        <div key={`${product.id}-${index}`} className="product-card">
                            <h2>{product.name}</h2>
                            <p>Price: ${product.price}</p>
                            <p>Description: {product.description}</p>
                            <p>Category: {product.category}</p>
                            <p>Inventory: {product.inventory}</p> {/* Display inventory */}
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
                    cart.filter(item => item !== null).map((product, index) => (
                        <div key={`${product.cartItemId}-${index}`} className="product-card">
                            <h2>{product.name}</h2>
                            <p>Price: ${product.price}</p>
                            <p>Description: {product.description}</p>
                            <p>Category: {product.category}</p>
                            <button onClick={() => handleRemoveFromCart(product.cartItemId)}>Remove</button>
                        </div>
                    ))
                )}
            </div>
            {cart.length > 0 && (
                <button onClick={handleBuyNow} className="buy-now-button">Buy Now</button>
            )}
            <Routes>
                <Route path="/payment" element={<Payment />} />
            </Routes>
        </div>
    );
}

export default ProductList;