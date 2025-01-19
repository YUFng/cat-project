import React from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import '../styles/Home.css';

function Home() {
    const navigate = useNavigate();

    const handleShopNow = () => {
        navigate('/products');
    };

    const carouselItems = [
        {
            image: 'images/rustic_floral_arrangement.jpg',
            title: 'Rustic Floral Arrangement',
            price: '$25.99',
            desc: 'Beautiful floral arrangement perfect for rustic-themed weddings.',
        },
        {
            image: 'images/tableware.jpg',
            title: 'Elegant Tableware Set',
            price: '$45.99',
            desc: 'Sophisticated tableware for a truly elegant event.',
        },
        {
            image: 'images/custombanner.jpg',
            title: 'Custom Banner',
            price: '$15.99',
            desc: 'Personalized banner for your special event.',
        },
    ];

    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
    };

    return (
        <div>
            <div className="home-container">
                <h1 className="home-header">Discover elegant and customizable decor for weddings and events</h1>
                <div className="featured-section">
                    <h2>Featured Products</h2>
                    <div className="carousel-container">
                        <Carousel
                            responsive={responsive}
                            infinite={true}
                            autoPlay={true}
                            autoPlaySpeed={3000}
                            keyBoardControl={true}
                            transitionDuration={500}
                            containerClass="carousel-container"
                        >
                            {carouselItems.map((item, index) => (
                                <div className="carousel-card" key={index}>
                                    <img src={item.image} alt={item.title} className="carousel-image" />
                                    <div className="carousel-card-content">
                                        <h2 className="carousel-card-title">{item.title}</h2>
                                        <p className="carousel-card-price">{item.price}</p>
                                        <p className="carousel-card-desc">{item.desc}</p>
                                        <button className="cta-button" onClick={handleShopNow}>
                                            Shop Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </Carousel>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="testimonials-section">
                    <h2>What Our Customers Say</h2>
                    <div className="testimonials-container">
                        <div className="testimonial-card">
                            <p>"Absolutely stunning decor! My wedding looked like a dream. Thank you for the amazing service!"</p>
                            <h4>- Emily R.</h4>
                        </div>
                        <div className="testimonial-card">
                            <p>"The tableware set was elegant and perfect for my dinner party. Great quality and fast delivery!"</p>
                            <h4>- Michael S.</h4>
                        </div>
                        <div className="testimonial-card">
                            <p>"The custom banner added a personal touch to my event. Highly recommended!"</p>
                            <h4>- Sarah J.</h4>
                        </div>
                        <div className="testimonial-card">
                            <p>"Exceptional service and beautiful products. The floral arrangement was breathtaking."</p>
                            <h4>- Laura W.</h4>
                        </div>
                        <div className="testimonial-card">
                            <p>"I’m beyond satisfied with the decor! It exceeded my expectations. Will order again."</p>
                            <h4>- David L.</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;