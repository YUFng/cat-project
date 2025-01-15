import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
    const navigate = useNavigate();

    const handleShopNow = () => {
        navigate('/products');
    };

    return (
        <div className="home-container">
            <h1 className="home-header">Welcome to Your Dream Event Planner</h1>
            <p className="home-subtitle">Discover elegant and customizable decor for weddings and events.</p>
            
            <div className="featured-section">
                <div className="featured-card">
                    <div className="featured-card-content">
                        <h2 className="featured-card-title">Rustic Floral Arrangement</h2>
                        <p className="featured-card-price">$25.99</p>
                        <p className="featured-card-desc">Beautiful floral arrangement perfect for rustic-themed weddings.</p>
                        <button className="cta-button" onClick={handleShopNow}>Shop Now</button>
                    </div>
                </div>
                
                <div className="featured-card">
                    <div className="featured-card-content">
                        <h2 className="featured-card-title">Elegant Tableware Set</h2>
                        <p className="featured-card-price">$45.99</p>
                        <p className="featured-card-desc">Sophisticated tableware for a truly elegant event.</p>
                        <button className="cta-button" onClick={handleShopNow}>Shop Now</button>
                    </div>
                </div>

                <div className="featured-card">
                    <div className="featured-card-content">
                        <h2 className="featured-card-title">Custom Banner</h2>
                        <p className="featured-card-price">$15.99</p>
                        <p className="featured-card-desc">Personalized banner for your special event.</p>
                        <button className="cta-button" onClick={handleShopNow}>Shop Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;