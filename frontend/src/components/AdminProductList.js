import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminProductList.css'; // Import the CSS file for styling

function AdminProductList() {
    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productInventory, setProductInventory] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get('http://localhost:8080/products', { withCredentials: true })
            .then(response => setProducts(response.data))
            .catch(error => {
                console.error('Error fetching products:', error);
                setProducts([]); // Ensure products is an array even if fetching fails
            });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const product = {
            id: productId,
            name: productName,
            price: parseFloat(productPrice),
            description: productDescription,
            category: productCategory,
            inventory: parseInt(productInventory)
        };

        axios.post('http://localhost:8080/products', product, { withCredentials: true })
            .then(response => {
                console.log('Success:', response.data);
                setProducts([...products, response.data]);
                resetForm();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleRemove = (productId) => {
        axios.delete(`http://localhost:8080/products?id=${productId}`, { withCredentials: true })
            .then(response => {
                console.log('Product removed:', response.data);
                setProducts(products.filter(product => product.id !== productId));
            })
            .catch(error => {
                console.error('Error removing product:', error);
            });
    };

    const handleEdit = (product) => {
        setProductId(product.id);
        setProductName(product.name);
        setProductPrice(product.price);
        setProductDescription(product.description);
        setProductCategory(product.category);
        setProductInventory(product.inventory);
    };

    const resetForm = () => {
        setProductId('');
        setProductName('');
        setProductPrice('');
        setProductDescription('');
        setProductCategory('');
        setProductInventory('');
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>Admin Product List</h2>
                <form onSubmit={handleSubmit} className="product-form">
                    <label htmlFor="productId">Product ID:</label>
                    <input
                        type="text"
                        id="productId"
                        name="productId"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        required
                        autoComplete="off"
                    />
                    <label htmlFor="productName">Product Name:</label>
                    <input
                        type="text"
                        id="productName"
                        name="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                        autoComplete="off"
                    />
                    <label htmlFor="productPrice">Product Price:</label>
                    <input
                        type="number"
                        id="productPrice"
                        name="productPrice"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        required
                        autoComplete="off"
                    />
                    <label htmlFor="productDescription">Product Description:</label>
                    <input
                        type="text"
                        id="productDescription"
                        name="productDescription"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        required
                        autoComplete="off"
                    />
                    <label htmlFor="productCategory">Product Category:</label>
                    <input
                        type="text"
                        id="productCategory"
                        name="productCategory"
                        value={productCategory}
                        onChange={(e) => setProductCategory(e.target.value)}
                        required
                        autoComplete="off"
                    />
                    <label htmlFor="productInventory">Product Inventory:</label>
                    <input
                        type="number"
                        id="productInventory"
                        name="productInventory"
                        value={productInventory}
                        onChange={(e) => setProductInventory(e.target.value)}
                        required
                        autoComplete="off"
                    />
                    <button type="submit">Submit</button>
                    <button type="button" onClick={resetForm}>Reset</button>
                </form>
            </div>
            <div className="product-grid">
                {products && products.length === 0 ? (
                    <p>No products available.</p>
                ) : (
                    products && products.map(product => (
                        <div key={product.id} className="product-card">
                            <img src={product.image} alt={product.name} className="product-image" />
                            <h2>{product.name}</h2>
                            <p>Price: ${product.price.toFixed(2)}</p>
                            <p>Description: {product.description}</p>
                            <p>Category: {product.category}</p>
                            <p>Inventory: {product.inventory}</p>
                            <button onClick={() => handleEdit(product)}>Edit</button>
                            <button onClick={() => handleRemove(product.id)}>Remove</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default AdminProductList;