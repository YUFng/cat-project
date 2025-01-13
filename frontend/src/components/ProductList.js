import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8080/products', { withCredentials: true })
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const handleAddToCart = (productId) => {
        axios.post(`http://localhost:8080/cart?productId=${productId}`, {}, { withCredentials: true })
            .then(response => console.log(response.data))
            .catch(error => console.error('Error adding product to cart:', error));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const product = {
            id: productId,
            name: productName,
            price: parseFloat(productPrice)
        };

        axios.post('http://localhost:8080/products', product, { withCredentials: true })
            .then(response => {
                console.log('Success:', response.data);
                setProducts([...products, response.data]);
                setProductId('');
                setProductName('');
                setProductPrice('');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleButtonClick = (productId) => {
        console.log(`Product ${productId} button clicked`);
        // Add your logic here
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
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
                <br />
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
                <br />
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
                <br />
                <button type="submit">Submit</button>
            </form>
            <div>
                {products.map(product => (
                    <div key={product.id}>
                        <h2>{product.name}</h2>
                        <p>Price: ${product.price}</p>
                        <button onClick={() => handleButtonClick(product.id)}>Buy Now</button>
                        <button onClick={() => handleAddToCart(product.id)}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;