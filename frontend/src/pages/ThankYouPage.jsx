import React, { useEffect, useRef, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { pushDataLayer } from '../lib/analytics';
import { mapProductToGA4 } from '../lib/mappers';
import './ThankYouPage.css';

const ThankYouPage = () => {
    const location = useLocation();
    const { order } = location.state || {};
    const { userInfo, isLoggedIn } = useContext(UserContext);

    useEffect(() => {
        // Ensure we have an order and haven't already tracked this specific transaction
        if (order && !sessionStorage.getItem(`purchase_sent_${order._id}`)) {
            
            const itemsForGA4 = order.orderItems.map((item, index) => {
                const ga4Item = mapProductToGA4(item);
                ga4Item.item_variant = item.variant;
                ga4Item.quantity = item.quantity;
                ga4Item.index = index + 1;
                return ga4Item;
            });
            
            setTimeout(() => {
                pushDataLayer({ ecommerce: null });
                pushDataLayer({
                    event: 'purchase',
                    user_status: isLoggedIn ? 'logged_in' : 'Guest User',
                    ecommerce: {
                        transaction_id: `dfdez-${order._id}-st`,
                        value: grandTotal,
                        tax: taxAmount,
                        shipping: shippingCost,
                        currency: 'EUR',
                        coupon: '',
                        items: itemsForGA4
                    }
                });
            }, 0);
            
            // Set a flag in sessionStorage to prevent this from firing again on reload
            sessionStorage.setItem(`purchase_sent_${order._id}`, 'true');
        }
    }, [order]);

    if (!order) {
        return (
            <div className="ThankYouPage ThankYouPage-empty">
                <h1>No Order Found</h1>
                <p>It looks like you haven't placed an order.</p>
                <Link to="/products" className="ThankYouPage-button">Continue Shopping</Link>
            </div>
        );
    }

    const shippingCost = 3;
    const taxAmount = parseFloat((order.totalPrice * (21 / 121)).toFixed(2));
    const grandTotal = parseFloat((order.totalPrice + shippingCost).toFixed(2));

    return (
        <div className="ThankYouPage">
            <div className="ThankYouPage-header">
                <h1>Thank You For Your Order, {userInfo?.firstName}!</h1>
                <p>Your order #{order._id} has been placed successfully.</p>
            </div>

            <div className="ThankYouPage-mainContent">
                <div className="ThankYouPage-orderSummary">
                    <h2>Order Summary</h2>
                    {order.orderItems.map(item => (
                        <div key={item._id || item.sku} className="ThankYouPage-item">
                            <img src={item.image} alt={item.name} loading='lazy'/>
                            <div className="ThankYouPage-itemDetails">
                                <h3>{item.name}</h3>
                                <p>Qty: {item.quantity}</p>
                            </div>
                            <span className="ThankYouPage-itemPrice">€{item.price.toFixed(2)}</span>
                        </div>
                    ))}

                    <div className="ThankYouPage-subtotalRow">
                        <strong>Subtotal</strong>
                        <strong>€{order.totalPrice.toFixed(2)}</strong>
                    </div>
                    <div className="ThankYouPage-subtotalRow">
                        <strong>Shipping</strong>
                        <strong>€{shippingCost.toFixed(2)}</strong>
                    </div>
                    <div className="ThankYouPage-totalRow">
                        <strong>Total</strong>
                        <strong>€{grandTotal.toFixed(2)}</strong>
                    </div>
                </div>

                <div className="ThankYouPage-shippingDetails">
                    <div className="ThankYouPage-shippingCard">
                        <h3>Shipping To</h3>
                        <p>{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <p>{order.shippingAddress.country}</p>
                    </div>
                    <div className="ThankYouPage-deliveryCard">
                        <h3>Estimated Delivery</h3>
                        <p className="ThankYouPage-deliveryDate">Approx. 5 days</p>
                        <p>You will receive a confirmation email with tracking details shortly.</p>
                    </div>
                </div>
            </div>
            
            <Link to="/products" className="ThankYouPage-button">Continue Shopping</Link>
        </div>
    );
};

export default ThankYouPage;
