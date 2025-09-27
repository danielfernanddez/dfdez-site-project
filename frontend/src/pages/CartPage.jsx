import React, { useContext, useEffect, useRef } from 'react'; // 1. Import useRef
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { pushDataLayer } from '../lib/analytics';
import { mapProductToGA4 } from '../lib/mappers';
import { UserContext } from '../context/UserContext';
import './CartPage.css';

const CartPage = () => {
    const { cartItems, removeFromCart } = useContext(CartContext);
    const eventPushed = useRef(false); // 2. Create the ref
    const { isLoggedIn } = useContext(UserContext);

    // GA4 view_cart event
    useEffect(() => { // Use the ref to prevent duplicate pushes from React Strict Mode
        if (!eventPushed.current) {
            let ecommerceData;
            if (cartItems.length > 0) {
                // If cart has items, build the full ecommerce object
                const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
                const itemsForGA4 = cartItems.map((item, index) => ({
                    ...mapProductToGA4(item),
                    item_variant: `${item.selectedColor.name} / ${item.selectedSize}`,
                    quantity: item.quantity,
                    index: index + 1
                }));
                ecommerceData = {
                    currency: 'EUR',
                    value: parseFloat(subtotal.toFixed(2)),
                    items: itemsForGA4
                };
            } else {
                // If cart is empty, build an ecommerce object with zeroed/empty values
                ecommerceData = {
                    currency: 'EUR',
                    value: 0,
                    items: []
                };
            } // Push the event to the dataLayer
            setTimeout(() => {
                pushDataLayer({ ecommerce: null });
                pushDataLayer({
                    event: 'view_cart',
                    user_status: isLoggedIn ? 'logged_in' : 'Guest User',
                    ecommerce: ecommerceData
                });
            }, 0);
            eventPushed.current = true;
        }
    }, [cartItems]);

    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);


    return (
        <div className="CartPage">
            <h1 className="CartPage-title">Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className="CartPage-empty">
                    <p>Your cart is empty.</p>
                    <Link to="/products">Continue Shopping</Link>
                </div>
            ) : (
                <div className="CartPage-container">
                    <div className="CartPage-items">
                        {cartItems.map(item => (
                            <div key={item.variantId} className="CartPage-item">
                                <img src={item.images[0]} alt={item.name} />
                                <div className="CartPage-itemDetails">
                                    <h3>{item.name}</h3>
                                    <p>Size: {item.selectedSize}</p>
                                    <p>Color: {item.selectedColor.name}</p>
                                    <p>Quantity: {item.quantity}</p>
                                </div>
                                <div className="CartPage-itemActions">
                                    <p>€{(item.price * item.quantity).toFixed(2)}</p>
                                    <button onClick={() => removeFromCart(item)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="CartPage-summary">
                        <h2>Order Summary</h2>
                        <div className="CartPage-summaryRow">
                            <span>Subtotal</span>
                            <span>€{subtotal.toFixed(2)}</span>
                        </div>
                        <Link to="/checkout" className="CartPage-checkoutButton">Proceed to Checkout</Link>
                    </div>
                </div>
            )}
        </div>
        
    );
};

export default CartPage;
