import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import './WishlistPage.css'; // New CSS file

const WishlistPage = () => {
    const { wishlistItems, toggleWishlistItem, moveFromWishlistToCart } = useContext(WishlistContext);

    return (
        <div className="WishlistPage">
            <h1 className="WishlistPage-title">My Wishlist</h1>
            {wishlistItems.length === 0 ? (
                <div className="WishlistPage-empty">
                    <p>Your wishlist is empty.</p>
                    <Link to="/products">Find Your Favorites</Link>
                </div>
            ) : (
                <div className="WishlistPage-grid">
                    {wishlistItems.map(item => (
                        <div key={item._id} className="WishlistPage-itemCard">
                            <Link to={`/product/${item._id}`}>
                                <img src={item.images[0]} alt={item.name} />
                            </Link>
                            <div className="WishlistPage-itemInfo">
                                <h3>{item.name}</h3>
                                <p>€{item.price.toFixed(2)}</p>
                                <div className="WishlistPage-actions">
                                    <button onClick={() => moveFromWishlistToCart(item)} className="WishlistPage-addToCartBtn">Add to Cart</button>
                                    <button onClick={() => toggleWishlistItem(item)} className="WishlistPage-removeBtn">Remove</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
