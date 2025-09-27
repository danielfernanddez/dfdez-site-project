import { createContext, useState, useEffect, useContext } from 'react';
import { pushDataLayer } from '../lib/analytics';
import { mapProductToGA4 } from '../lib/mappers';
import { UserContext } from './UserContext';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            return [];
        }
    });
    const { isLoggedIn } = useContext(UserContext);
    const [isModalOpen , setIsModalOpen] = useState(false);
    const [addedProduct , setAddedProduct] = useState(null);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const openModal = (product) => {
        setAddedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setAddedProduct(null);
    };

    const addToCart = (product, size, color) => {
        const variantId = `${product.sku}-${size}-${color.name}`;
        const existingItem = cartItems.find(item => item.variantId === variantId);
        
        // Determine the correct price to use (sale price or regular price)
        const finalPrice = (product.discountPrice && product.discountPrice > 0) ? product.discountPrice : product.price;

        if (existingItem) {
            setCartItems(cartItems.map(item =>
                item.variantId === variantId ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            const newItem = {
                ...product,
                variantId: variantId,
                selectedSize: size,
                selectedColor: color,
                quantity: 1,
                price: finalPrice, 
            };
            setCartItems(prevItems => [...prevItems, newItem]);
        }

        const itemForGA4 = {
            ...mapProductToGA4(product),
            item_variant: `${color.name} / ${size}`,
            quantity: 1,
            price: finalPrice // Ensure the price in the event also reflects the final price
        };

        pushDataLayer({ ecommerce: null });
        pushDataLayer({
            event: 'add_to_cart',
            user_status: isLoggedIn ? 'logged_in' : 'Guest User',
            ecommerce: {
                currency: product.currency,
                value: finalPrice,
                items: [itemForGA4]
            }
        });

        openModal(product);
    };

    const removeFromCart = (itemToRemove) => {
        setCartItems(cartItems.filter(item => item.variantId !== itemToRemove.variantId));

        const itemForGA4 = {
            ...mapProductToGA4(itemToRemove),
            item_variant: `${itemToRemove.selectedColor.name} / ${itemToRemove.selectedSize}`,
            quantity: itemToRemove.quantity,
        };

        pushDataLayer({ ecommerce: null });
        pushDataLayer({
            event: 'remove_from_cart',
            user_status: isLoggedIn ? 'logged_in' : 'Guest User',
            ecommerce: {
                currency: itemToRemove.currency,
                value: itemForGA4.price * itemToRemove.quantity,
                items: [itemForGA4]
            }
        });
    };
    
    const clearCart = () => {
        setCartItems([]);
    };

    const value = { cartItems, addToCart, removeFromCart, clearCart, isModalOpen, addedProduct, closeModal };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
