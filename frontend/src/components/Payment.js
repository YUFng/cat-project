import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';
import '../styles/Payment.css'; // Import the CSS file for styling

function Payment() {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState([]);
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        axios.get(`http://localhost:8080/cart?username=${user.username}`, { withCredentials: true })
            .then(response => {
                setCart(response.data);
            })
            .catch(error => console.error('Error fetching cart:', error));

        axios.get(`http://localhost:8080/user/address?username=${user.username}`, { withCredentials: true })
            .then(response => {
                setAddress(response.data[user.username]);
            })
            .catch(error => console.error('Error fetching address:', error));
    }, [user, navigate]);

    const handlePayNow = () => {
        const order = {
            username: user.username,
            address,
            products: cart,
            paymentMethod
        };

        axios.post('http://localhost:8080/orders', order, { withCredentials: true })
            .then(response => {
                alert('Payment successful!');
                navigate('/');
            })
            .catch(error => {
                alert('Error processing payment: ' + error.message);
            });
    };

    if (!user) {
        return null; // Render nothing if user is not authenticated
    }

    const totalPrice = cart.reduce((total, product) => total + product.price, 0).toFixed(2);

    return (
        <div className="payment-container">
            <button onClick={() => navigate(-1)} className="back-button">Back</button>
            <h2>Payment Page</h2>
            <div className="order-summary">
                <h3>Order Summary</h3>
                {cart.map(product => (
                    <div key={product.id} className="product-summary">
                        <p><strong>{product.name}</strong></p>
                        <p>Price: ${product.price}</p>
                    </div>
                ))}
                <p><strong>Total Price:</strong> ${totalPrice}</p>
            </div>
            <div className="address-section">
                <h3>Delivery Address</h3>
                <p>{address}</p>
            </div>
            <div className="payment-method-section">
                <h3>Payment Method</h3>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                </select>
            </div>
            <button onClick={handlePayNow} className="pay-now-button">Pay Now</button>
        </div>
    );
}

export default Payment;