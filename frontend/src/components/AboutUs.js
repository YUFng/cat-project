import React from 'react';
import '../styles/AboutUs.css';

const AboutUs = () => {
    const members = [
        {
            name: 'Queek Yu Feng',
            position: 'Team Leader',
            image: '/images/yf-pic.jpg', // Replace with actual image path
        },
        {
            name: 'Shivabala A/L Ganeish',
            position: 'GUI Developer',
            image: '/images/shiva-pic.jpg', // Replace with actual image path
        },
        {
            name: 'Pavithran A/L Muthiah',
            position: 'Content Creator Developer',
            image: '/images/pavi-pic.jpg', // Replace with actual image path
        },
    ];

    return (
        <div className="about-us">

            <div className="about-us-content">
                <header>
                    <h1>Meet The EverAfter Creations Team</h1>
                    <p>
                        Welcome to EverAfter Creations where you can trust us to take of your present for your future.
                        We are a passionate team dedicated to taking care of all your wedding prep and needs.
                        Our goal is to ensure our customers get the utmost satisfaction with our products and services.
                    </p>
                </header>

                <h2>Meet The Team</h2>
                <div className="members">
                    {members.map((member, index) => (
                        <div className="member-card" key={index}>
                            <img src={member.image} alt={member.name} className="member-image"/>
                            <h2>{member.name}</h2>
                            <p>{member.position}</p>
                        </div>
                    ))}
                </div>

                <div className="mission">
                    <h2>Our Mission</h2>
                    <p>
                        To ensure the wedding ceremony isn't the only thing which made the day special but
                        the decor and prep that goes into making the wedding special.
                    </p>
                </div>
                </div>
            </div>
            );
            };

            export default AboutUs;