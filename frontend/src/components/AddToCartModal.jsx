import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './AddToCartModal.css';

const AddToCartModal = () => {
    const { isModalOpen, addedProduct, closeModal } = useContext(CartContext);

    // If the modal isn't open or there's no product, render nothing
    if (!isModalOpen || !addedProduct) {
        return null;
    }

    return (
        <div className="AddToCartModal-overlay" onClick={closeModal}>
            <div className="AddToCartModal-content" onClick={(e) => e.stopPropagation()}>
                <div className='AddToCartModal-div'>
                    <div className="AddToCartModal-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <h2 className="AddToCartModal-title">You've added the product to the cart</h2>
                </div>
                <div className="AddToCartModal-product">
                    <img src={addedProduct.images[0]} alt={addedProduct.name} loading='lazy'/>
                    <span>{addedProduct.name}</span>
                </div>
                <div className="AddToCartModal-actions">
                    <Link to="/products" className="AddToCartModal-button secondary" onClick={closeModal}>
                        Continue Shopping
                    </Link>
                    <Link to="/checkout" className="AddToCartModal-button primary" onClick={closeModal}>
                        Go to Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AddToCartModal;
