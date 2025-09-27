import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { mapProductToGA4 } from '../lib/mappers';
import { pushDataLayer } from '../lib/analytics';
import { WishlistContext } from '../context/WishlistContext';
import { UserContext } from '../context/UserContext';
import Newsletter from '../components/Newsletter';
import './SalesPage.css';

const SalesPage = () => {
    const { toggleWishlistItem, isProductInWishlist } = useContext(WishlistContext);
    const { isLoggedIn } = useContext(UserContext);
    const [saleProducts, setSaleProducts] = useState([]);
    const eventPushed = useRef(false);

    useEffect(() => {
        const fetchSaleProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5001/api/products');
                
                const onSaleProducts = data.filter(product => product.discountPrice && product.discountPrice !== "");
                setSaleProducts(onSaleProducts);

                if (onSaleProducts.length > 0 && !eventPushed.current) {
                    setTimeout(() => {
                        pushDataLayer({ ecommerce: null });
                        pushDataLayer({
                            event: 'view_item_list',
                            user_status: isLoggedIn ? 'logged_in' : 'Guest User',
                            ecommerce: {
                                item_list_id: 'sales_page',
                                item_list_name: 'Sales Page',
                                items: onSaleProducts.map((product, index) => ({
                                    ...mapProductToGA4(product),
                                    index: index + 1
                                }))
                            }
                        });
                    }, 0);
                    eventPushed.current = true;
                }
            } catch (error) {
                console.error("Error fetching sale products:", error);
            }
        };
        fetchSaleProducts();
    }, []);

    const handleItemSelect = (product, index) => {
        const itemForGA4 = {
            ...mapProductToGA4(product),
            index: index + 1
        };
        pushDataLayer({ ecommerce: null });
        pushDataLayer({
            event: 'select_item',
            user_status: isLoggedIn ? 'logged_in' : 'Guest User',
            ecommerce: {
                item_list_id: 'sales_page',
                item_list_name: 'Sales Page',
                items: [itemForGA4]
            }
        });
    };

    const handleWishlistClick = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlistItem(product);
    };

    return (
        <div className="SalesPage">
            <div className="SalesPage-heroBanner">
                <h1>SALE</h1>
                <p>Discover our best deals!</p>
            </div>
            <div className="SalesPage-containerWrapper">
                <div className="SalesPage-grid">
                    {saleProducts.map((product, index) => (
                        <Link
                            to={`/product/${product._id}`}
                            key={product._id}
                            className="SalesPage-productCard"
                            onClick={() => handleItemSelect(product, index)}
                            state={{
                                isSale: true,
                                originalPrice: product.price,
                                discountPrice: product.discountPrice
                            }}
                        >
                            <div className="SalesPage-imageContainer">
                                <img src={product.images[0]} alt={product.name} />
                                <div className="SalesPage-saleLabel">SALE</div>
                                <button
                                    className={`SalesPage-wishlistButton ${isProductInWishlist(product._id) ? 'active' : ''}`}
                                    onClick={(e) => handleWishlistClick(e, product)}
                                    aria-label="Toggle wishlist"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                </button>
                            </div>
                            <div className="SalesPage-info">
                                <h3>{product.name}</h3>
                                <div className="SalesPage-priceContainer">
                                    <span className="SalesPage-originalPrice">€{product.price.toFixed(2)}</span>
                                    <span className="SalesPage-discountPrice">€{product.discountPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <Newsletter formLocation="homepage_promo" />
        </div>
    );
};

export default SalesPage;
