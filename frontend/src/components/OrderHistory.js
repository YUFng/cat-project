import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';
import '../styles/OrderHistory.css'; // Import the CSS file for styling

function OrderHistory() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        axios.get(`http://localhost:8080/orders?username=${user.username}`, { withCredentials: true })
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => console.error('Error fetching orders:', error));
    }, [user, navigate]);

    if (!user) {
        return null; // Render nothing if user is not authenticated
    }

    const handleScrollToBottom = () => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    };

    return (
        <div className="order-history">
            <button onClick={() => navigate(-1)} className="back-button">Back</button>
            <h1>Order History</h1>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="orders">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <p><strong>Order ID:</strong> {order.id}</p>
                            <div className="products-container">
                                <p><strong>Products:</strong></p>
                                <ul>
                                    {order.products.map(product => (
                                        <li key={product.id}>{product.name} - ${product.price.toFixed(2)}</li>
                                    ))}
                                </ul>
                            </div>
                            <p><strong>Total Price:</strong> ${order.products.reduce((total, product) => total + product.price, 0).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            )}
                <button onClick={handleScrollToBottom} className="scroll-to-bottom-button">↓</button>
        </div>
    );
}

export default OrderHistory;