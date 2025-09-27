import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const [time, setTime] = useState('');

    useEffect(() => {
        // Function to format time as HH:MM:SS
        const getTime = () => {
            return new Date().toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
        };

        // Set initial time and then update every second
        setTime(getTime());
        const timer = setInterval(() => {
            setTime(getTime());
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(timer);
    }, []);

    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const currentDate = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY

    return (
        <footer className="Footer">
            <div className="Footer-mainContent">
                {/* Column 1: Description */}
                <div className="Footer-column-p">
                    <p className="Footer-description">
                        An e-commerce project for testing analytics implementations.
                        Built with React, Node.js and MongoDB.
                    </p>
                    <p className="Footer-description">
                        Tracked with GTM & GA4 Enhanced Ecommerce dataLayer.
                    </p>
                </div>

                {/* Column 2: Contact */}
                <div className="Footer-column">
                    <h4 className="Footer-heading">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        Contact
                    </h4>
                    <a href="mailto:danielfernandddez@gmail.com" className="Footer-link">danielfernandddez@gmail.com</a>
                    <a href="tel:+34 626 230 286" className="Footer-link">+34 626 230 286</a>
                    <p className="Footer-address">
                        First Party Cookie Street, 256<br />
                        Madrid, Community of Madrid, Spain
                    </p>
                </div>

                {/* Column 3: Navigation */}
                <div className="Footer-column">
                    <h4 className="Footer-heading">Navigation</h4>
                    <ul className="Footer-navList">
                        <li><Link to="/" className="Footer-navLink">Home</Link></li>
                        <li><Link to="/products" className="Footer-navLink">Products</Link></li>
                        <li><Link to="/sales" className="Footer-navLink">Sales</Link></li>
                        <li><Link to="/contact" className="Footer-navLink">Contact Us</Link></li>
                        <li><Link to="/wishlist" className="Footer-navLink">Wishlist</Link></li>
                        <li><Link to="/profile-account" className="Footer-navLink">My Account</Link></li>
                    </ul>
                </div>

                {/* Column 4: Connect */}
                <div className="Footer-column">
                    <h4 className="Footer-heading">Connect</h4>
                    <ul className="Footer-connectList">
                        <li>
                            <a href="https://www.linkedin.com/in/danielfernanddez/" target="_blank" rel="noopener noreferrer" className="Footer-link">
                                LinkedIn
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7"></path><path d="M7 7h10v10"></path></svg>
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/danielfernanddez" target="_blank" rel="noopener noreferrer" className="Footer-link">
                                Github
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7"></path><path d="M7 7h10v10"></path></svg>
                            </a>
                        </li>
                        <li>
                            <a href="xxxxxxxxxxxx.pdf" target="_blank" rel="noopener noreferrer" className="Footer-link">
                                Download my CV
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7"></path><path d="M7 7h10v10"></path></svg>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="Footer-bottomBar">
                <span>© {new Date().getFullYear()} DFDEZ STORE</span>
                <span>COOKIES</span>
                <span>{currentDay} {currentDate} {time} MAD</span>
            </div>

            <div className="Footer-backgroundLogo">
                DfdezStore
            </div>
        </footer>
    );
};

export default Footer;
