import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';
import { pushDataLayer } from '../lib/analytics';
import { mapProductToGA4 } from '../lib/mappers';
import axios from 'axios';
import api from '../api/axios';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const [step, setStep] = useState(1);
    const [activeTab, setActiveTab] = useState('login');
    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });

    const { cartItems, clearCart } = useContext(CartContext);
    const { isLoggedIn, login, register, userInfo } = useContext(UserContext);
    const navigate = useNavigate();
    const eventPushed = useRef({ begin_checkout: false });

    // --- begin_checkout event ---
    useEffect(() => {
        if (cartItems.length > 0 && !eventPushed.current.begin_checkout) {
            const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
            const itemsForGA4 = cartItems.map((item, index) => ({
                ...mapProductToGA4(item),
                item_variant: `${item.selectedColor.name} / ${item.selectedSize}`,
                quantity: item.quantity,
                index: index + 1
            }));
            setTimeout(() => {
                pushDataLayer({ ecommerce: null });
                pushDataLayer({
                    event: 'begin_checkout',
                    user_status: isLoggedIn ? 'logged_in' : 'Guest User',
                    ecommerce: {
                        currency: 'EUR',
                        value: parseFloat(subtotal.toFixed(2)),
                        items: itemsForGA4
                    }
                });
            }, 0);
            eventPushed.current.begin_checkout = true;
        }
    }, [cartItems]);

    // Skip step 1 if already logged in
    useEffect(() => {
        if (isLoggedIn) {
            setStep(2);
        }
    }, [isLoggedIn]);

    // Pre-fill shipping form if user info exists
    useEffect(() => {
        if (userInfo) {
            setShippingInfo(prevInfo => ({
                ...prevInfo,
                fullName: `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim(),
                city: userInfo.city || '',
                country: userInfo.country || '',
            }));
        }
    }, [userInfo]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = Object.fromEntries(new FormData(e.target).entries());
        try {
            await login(email, password);
            setStep(2);
        } catch (error) {
            alert('Invalid credentials');
        }
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        const userData = Object.fromEntries(new FormData(e.target).entries());
        try {
            await register(userData);
            setStep(2);
        } catch (error) {
            alert('User with this email already exists!');
        }
    };

    const handleShipping = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newShippingInfo = Object.fromEntries(formData.entries());
        setShippingInfo(newShippingInfo);

        const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
        pushDataLayer({ ecommerce: null });
        pushDataLayer({
            event: 'add_shipping_info',
            user_status: isLoggedIn ? 'logged_in' : 'Guest User',
            ecommerce: {
                currency: 'EUR',
                value: parseFloat(subtotal.toFixed(2)),
                shipping_tier: 'Ground',
                items: cartItems.map(item => ({
                    ...mapProductToGA4(item),
                    item_variant: `${item.selectedColor.name} / ${item.selectedSize}`,
                    quantity: item.quantity,
                }))
            }
        });
        setStep(3);
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
        pushDataLayer({ ecommerce: null });
        pushDataLayer({
            event: 'add_payment_info',
            user_status: isLoggedIn ? 'logged_in' : 'Guest User',
            ecommerce: {
                currency: 'EUR',
                value: parseFloat(subtotal.toFixed(2)),
                payment_type: 'Credit Card',
                items: cartItems.map(item => ({
                    ...mapProductToGA4(item),
                    item_variant: `${item.selectedColor.name} / ${item.selectedSize}`,
                    quantity: item.quantity,
                }))
            }
        });

        try {
            const orderData = {
                orderItems:cartItems.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    image: (item.images && item.images[0]) || item.image,
                    price: item.price,
                    sku: item.sku,
                    brand: item.brand,
                    categories: item.categories,
                    variant: `${item.selectedColor.name} / ${item.selectedSize}`,
                    affiliation: item.affiliation,
                    _id: item._id
                })),
                shippingAddress: shippingInfo,
                totalPrice: subtotal,
            };
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data: createOrder } = await api.post('/api/orders', orderData, config);
            navigate('/thank-you', { state: { order: createOrder } });
            clearCart();

        } catch (error) {
            console.error('Failed to process payment and create order:', error);
            alert('There was an issue processing your order. Please try again.')
        }        
    };

    return (
        <div className="CheckoutPage">
            <h1>Checkout</h1>
            <div className="CheckoutPage-steps">
                <div className={`CheckoutPage-step ${step >= 1 ? 'active' : ''}`}>1. Account</div>
                <div className={`CheckoutPage-step ${step >= 2 ? 'active' : ''}`}>2. Shipping</div>
                <div className={`CheckoutPage-step ${step >= 3 ? 'active' : ''}`}>3. Payment</div>
            </div>

            {step === 1 && !isLoggedIn && (
                <div className="CheckoutPage-authContainer">
                    <div className="CheckoutPage-tabs">
                        <button className={activeTab === 'login' ? 'active' : ''} onClick={() => setActiveTab('login')}>Login</button>
                        <button className={activeTab === 'create' ? 'active' : ''} onClick={() => setActiveTab('create')}>Create Account</button>
                    </div>

                    {activeTab === 'login' && (
                        <form onSubmit={handleLogin} className="CheckoutPage-form">
                            <h2>Login to Your Account</h2>
                            <div className="CheckoutPage-inputGroup">
                                <label htmlFor="login-email">Email</label>
                                <input id="login-email" name="email" type="email" required />
                            </div>
                            <div className="CheckoutPage-inputGroup">
                                <label htmlFor="login-password">Password</label>
                                <input id="login-password" name="password" type="password" required />
                            </div>
                            <button type="submit">Login & Continue</button>
                        </form>
                    )}

                    {activeTab === 'create' && (
                         <form onSubmit={handleCreateAccount} className="CheckoutPage-form">
                            <h2>Create a New Account</h2>
                            <div className="CheckoutPage-formRow">
                                <div className="CheckoutPage-inputGroup"><label htmlFor="create-firstname">First Name</label><input id="create-firstname" name="firstName" type="text" required /></div>
                                <div className="CheckoutPage-inputGroup"><label htmlFor="create-lastname">Last Name</label><input id="create-lastname" name="lastName" type="text" required /></div>
                            </div>
                            <div className="CheckoutPage-inputGroup"><label htmlFor="create-email">Email</label><input id="create-email" name="email" type="email" required /></div>
                            <div className="CheckoutPage-inputGroup"><label htmlFor="create-password">Password</label><input id="create-password" name="password" type="password" required /></div>
                            <div className="CheckoutPage-formRow">
                                <div className="CheckoutPage-inputGroup"><label htmlFor="create-phone">Phone Number</label><input id="create-phone" name="phone" type="tel" /></div>
                                <div className="CheckoutPage-inputGroup"><label htmlFor="create-city">City</label><input id="create-city" name="city" type="text" /></div>
                                <div className="CheckoutPage-inputGroup"><label htmlFor="create-country">Country</label><input id="create-country" name="country" type="text" /></div>
                            </div>
                            <button type="submit">Create Account & Continue</button>
                        </form>
                    )}
                </div>
            )}

            {step === 2 && (
                <form onSubmit={handleShipping} className="CheckoutPage-form">
                    <h2>Step 2: Shipping Information</h2>
                    <div className="CheckoutPage-inputGroup">
                        <label htmlFor="fullName">Full Name</label>
                        <input id="fullName" name="fullName" type="text" defaultValue={shippingInfo.fullName} required />
                    </div>
                    <div className="CheckoutPage-inputGroup">
                        <label htmlFor="address">Street Address</label>
                        <input id="address" name="address" type="text" required />
                    </div>
                    <div className="CheckoutPage-formRow">
                        <div className="CheckoutPage-inputGroup">
                            <label htmlFor="city">City</label>
                            <input id="city" name="city" type="text" defaultValue={shippingInfo.city} required />
                        </div>
                        <div className="CheckoutPage-inputGroup">
                            <label htmlFor="postalCode">Postal Code</label>
                            <input id="postalCode" name="postalCode" type="text" required />
                        </div>
                    </div>
                    <div className="CheckoutPage-inputGroup">
                        <label htmlFor="country">Country</label>
                        <input id="country" name="country" type="text" defaultValue={shippingInfo.country} required />
                    </div>
                    <button type="submit">Continue to Payment</button>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={handlePayment} className="CheckoutPage-form">
                    <h2>Step 3: Payment Information</h2>
                    <div className="CheckoutPage-inputGroup">
                        <label htmlFor="cardnumber">Card Number</label>
                        <input id="cardNumber" name="cardNumber" type="text" placeholder='000000' required/>
                    </div>
                    <div className="CheckoutPage-inputGroup">
                        <label htmlFor="cardname">Card Name</label>
                        <input id="cardName" name="cardName" type="text" placeholder='Card Holder Name' required/>
                    </div>
                    <div className="CheckoutPage-formRow">
                        <div className="CheckoutPage-inputGroup">
                            <label htmlFor="expiration">Expiry Date</label>
                            <input id="expiration" name="expiration" type="text" placeholder='MM/YY' required />
                        </div>
                        <div className="CheckoutPage-inputGroup">
                            <label htmlFor="cvv">CVV</label>
                            <input id="cvv" name="cvv" type="text" placeholder='CVV' required />
                        </div>
                    </div>
                    <button type="submit">Complete Purchase</button>
                </form>
            )}
        </div>
    );
};

export default CheckoutPage;
