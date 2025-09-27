import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import './ProductsPage.css';
import axios from 'axios';
import { mapProductToGA4 } from '../lib/mappers';
import { pushDataLayer } from '../lib/analytics';
import { WishlistContext } from '../context/WishlistContext';
import { UserContext } from '../context/UserContext';
import Newsletter from '../components/Newsletter';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const eventPushed = useRef(false);
    const { toggleWishlistItem, isProductInWishlist } = useContext(WishlistContext);
    const { isLoggedIn } = useContext(UserContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5001/api/products');
                const regularProducts = data.filter(product => !product.discountPrice || product.discountPrice === "");
                setProducts(regularProducts);
                
                if (regularProducts.length > 0 && !eventPushed.current) {
                    setTimeout(() => {
                        pushDataLayer({ ecommerce: null });
                        pushDataLayer({
                            event: 'view_item_list',
                            user_status: isLoggedIn ? 'logged_in' : 'Guest User',
                            ecommerce: {
                                item_list_id: 'all_products_page',
                                item_list_name: 'All Products',
                                items: regularProducts.map((product, index) => ({
                                    ...mapProductToGA4(product),
                                    index: index + 1
                                }))
                            }
                        });
                    }, 0);
                    
                    eventPushed.current = true;
                }
                
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
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
                item_list_id: 'all_products_page',
                item_list_name: 'All Products',
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
        <div className="ProductsPage">
            <div className="ProductsPage-heroBanner">
                <img src="/images/heros/products-hero-banner.webp" alt="Our Latest Collection" className="ProductsPage-heroImage" />
                <div className="ProductsPage-heroOverlay">
                    <h1>Explore Our Collection</h1>
                    <p>Find your next favorite item.</p>
                </div>
            </div>

            <div className="ProductsPage-containerWrapper">
                <h2 className="ProductsPage-pageTitle">All Products</h2>
                <div className="ProductsPage-grid">
                    {products.map((product, index) => (
                        <Link 
                            to={`/product/${product._id}`} 
                            key={product._id} 
                            className="ProductsPage-productCard"
                            onClick={() => handleItemSelect(product, index)}
                        >
                            <div className="ProductsPage-imageContainer">
                                <img src={product.images[0]} alt={product.name} />
                                
                                <button 
                                    className={`ProductsPage-wishlistButton ${isProductInWishlist(product._id) ? 'active' : ''}`}
                                    onClick={(e) => handleWishlistClick(e, product)}
                                    aria-label="Add to wishlist"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                </button>

                                <button className="ProductsPage-quickViewButton">Quick View</button>
                            </div>
                            <div className="ProductsPage-info">
                                <h3 className="ProductsPage-name">{product.name}</h3>
                                <p className="ProductsPage-price">€{product.price.toFixed(2)}</p>                               
                            </div>
                            <span className='ProductsPage-rating'>{'⭐'.repeat(Math.round(product.rating))} ({product.numReviews})</span>
                        </Link>
                    ))}
                </div>
            </div>
            <Newsletter formLocation="homepage_promo" />        
        </div>
    );
};

export default ProductsPage;
