import React, { createContext, useState, useEffect, useContext } from 'react';
import { pushDataLayer } from '../lib/analytics';
import { mapProductToGA4 } from '../lib/mappers';
import { CartContext } from './CartContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState(() => {
        try {
            const localData = localStorage.getItem('wishlistItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            return [];
        }
    });

    const { addToCart } = useContext(CartContext); // For moving items to cart

    useEffect(() => {
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const toggleWishlistItem = (product) => {
        const isItemInWishlist = wishlistItems.some(item => item._id === product._id);

        if (isItemInWishlist) {
            // --- Remove from Wishlist ---
            setWishlistItems(wishlistItems.filter(item => item._id !== product._id));
            
            // GA4 remove_from_wishlist event
            pushDataLayer({ ecommerce: null });
            pushDataLayer({
                event: 'remove_from_wishlist',
                ecommerce: {
                    value: product.price,
                    currency: product.currency,
                    items: [mapProductToGA4(product)]
                }
            });
        } else {
            // --- Add to Wishlist ---
            setWishlistItems(prevItems => [...prevItems, product]);
            
            // GA4 add_to_wishlist event
            pushDataLayer({ ecommerce: null });
            pushDataLayer({
                event: 'add_to_wishlist',
                ecommerce: {
                    value: product.price,
                    currency: product.currency,
                    items: [mapProductToGA4(product)]
                }
            });
        }
    };

    const isProductInWishlist = (productId) => {
        return wishlistItems.some(item => item._id === productId);
    };

    const moveFromWishlistToCart = (product) => {
        // Here you would ask for size/color, but for simplicity, we'll use defaults
        const defaultColor = product.colorVariants[0] || { name: 'Default' };
        const defaultSize = product.availableSizes[0] || 'M';
        
        addToCart(product, defaultSize, defaultColor);
        toggleWishlistItem(product); // Remove from wishlist after adding to cart
    };

    const value = {
        wishlistItems,
        toggleWishlistItem,
        isProductInWishlist,
        moveFromWishlistToCart,
    };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
