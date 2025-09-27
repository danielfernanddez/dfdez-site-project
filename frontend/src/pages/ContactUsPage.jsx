import React, { useState, useRef, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import SHA256 from 'crypto-js/sha256';
import { pushDataLayer } from '../lib/analytics';
import Newsletter from '../components/Newsletter';
import './ContactUsPage.css';

const ContactUsPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        inquiry: 'general',
        message: '',
    });
    const formStarted = useRef(false);
    const { isLoggedIn } = useContext(UserContext);

    const hashData = (data) => data ? SHA256(data.toString().trim().toLowerCase()).toString() : "";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleFormStart = () => {
        if (!formStarted.current) {
            pushDataLayer({
                event: 'form_start',
                user_status: isLoggedIn ? 'logged_in' : 'Guest User',
                form_name: 'contact_us_form',
                form_location: 'contact_us_page'
            });
            formStarted.current = true;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        pushDataLayer({
            event: 'generate_lead',
            user_status: isLoggedIn ? 'logged_in' : 'Guest User',
            lead_type: formData.inquiry,
            form_location: 'contact_us_page',
            page_path: window.location.pathname,
            user: {
                user_em_plain: formData.email,
                user_em_hash: hashData(formData.email)
            }
        });

        alert('Thank you for your message! We will get back to you shortly.');
        setFormData({ name: '', email: '', inquiry: 'general', message: '' });
    };

    return (
        <div className="ContactUsPage">
            <section className="ContactUsPage-hero">
                <div className="ContactUsPage-heroContent">
                    <h1>Contact Us - Lead Gen Form</h1>
                    <p>Have a question? Let's talk.</p>
                </div>
            </section>

            <section className="ContactUsPage-main">
                <div className="ContactUsPage-contentWrapper">
                    <div className="ContactUsPage-formContainer">
                        <h2>Send Us a Message</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="ContactUsPage-inputGroup">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    onFocus={handleFormStart}
                                />
                            </div>
                            <div className="ContactUsPage-inputGroup">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="ContactUsPage-inputGroup">
                                <label htmlFor="inquiry">What can we help you with?</label>
                                <select id="inquiry" name="inquiry" value={formData.inquiry} onChange={handleChange}>
                                    <option value="general">General Inquiry</option>
                                    <option value="support">Customer Support</option>
                                    <option value="sales">Sales & Partnerships</option>
                                    <option value="feedback">Website Feedback</option>
                                </select>
                            </div>
                            <div className="ContactUsPage-inputGroup">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required style={{resize: 'none'}}></textarea>
                            </div>
                            <button type="submit" className="ContactUsPage-ctaButton">Get In Touch</button>
                        </form>
                    </div>

                    <div className="ContactUsPage-benefits">
                        <div className="ContactUsPage-benefitItem">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            <div className="ContactUsPage-benefitText">
                                <h3>Fast Response</h3>
                                <p>We typically reply within 24 hours on business days.</p>
                            </div>
                        </div>
                        <div className="ContactUsPage-benefitItem">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            <div className="ContactUsPage-benefitText">
                                <h3>Secure & Confidential</h3>
                                <p>Your information is kept private and secure.</p>
                            </div>
                        </div>
                        <div className="ContactUsPage-benefitItem">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            <div className="ContactUsPage-benefitText">
                                <h3>Expert Support</h3>
                                <p>Our team is ready to provide you with expert advice.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Newsletter formLocation="homepage_promo" />
        </div>
    );
};

export default ContactUsPage;
