import { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { mapProductToGA4 } from "../lib/mappers";
import { pushDataLayer } from "../lib/analytics";
import { WishlistContext } from "../context/WishlistContext";
import { UserContext } from "../context/UserContext";
import "./HomePage.css";
import Newsletter from "../components/Newsletter";
import VideoSection from "../components/VideoSection";
import api from "../api/axios";

const HomePage = () => {
    const { toggleWishlistItem, isProductInWishlist } = useContext(WishlistContext);
    const [products, setProducts] = useState([]);
    const [saleProducts, setSaleProducts] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const eventPushed = useRef(false);
    const { isLoggedIn } = useContext(UserContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get("/api/products");
                setProducts(data.filter(p => !p.discountPrice || p.discountPrice === ""));
                setSaleProducts(data.filter(p => p.discountPrice && p.discountPrice !== ""));
                if (data.length > 0 && !eventPushed.current) {
                    setTimeout(() => {
                        pushDataLayer({ ecommerce: null });
                        pushDataLayer({
                            event: "view_item_list",
                            user_status: isLoggedIn ? 'logged_in' : 'Guest User',
                            ecommerce: {
                                item_list_id: "homepage_main",
                                item_list_name: "Homepage Main",
                                items: data.map((product, index) => ({
                                    ...mapProductToGA4(product),
                                    index: index + 1,
                                })),
                            },
                        });
                    }, 0);
                    eventPushed.current = true;
                }
                setIsDataLoaded(true);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    const handleItemSelect = (product, listName, listId, index) => {
        const itemForGA4 = {
            ...mapProductToGA4(product),
            index: index + 1
        };
        pushDataLayer({ ecommerce: null });
        pushDataLayer({
            event: 'select_item',
            user_status: isLoggedIn ? 'logged_in' : 'Guest User',
            ecommerce: {
                item_list_id: listId,
                item_list_name: listName,
                items: [itemForGA4]
            }
        });
    };

    const handleWishlistClick = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlistItem(product);
    };

    const holyPromoBanner = { id: 'promo_holy_sale', isPromo: true, name: 'Holy Sale Event', creative: 'holy-sale-banner', slot: 'homepage_banner_1', imageSrc: '/images/heros/banner-promo-holy.webp', alt: 'Banner Promo Holy'};

    const otherBanners = [
        { id: 'promo_clothes_collection', isPromo: false, imageSrc: '/images/heros/homepage-banner-400-200-clothes.webp', alt: 'Banner Clothes' },
        { id: 'promo_50_off', isPromo: true, name: '50% Off Select Items', creative: '50-off-banner', slot: 'homepage_banner_3', imageSrc: '/images/heros/banner-promo-50.webp', alt: 'Banner Promo 50' },
        { id: 'promo_gym_gear', isPromo: false, imageSrc: '/images/heros/homepage-banner-400-200-gym.webp', alt: 'Banner Gym' }
    ];

    const allPromotions = [holyPromoBanner, ...otherBanners.filter(b => b.isPromo)];

    const promotionBannersRef = useRef(null);
    const viewedPromotionsRef = useRef(new Set());

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const promoId = entry.target.dataset.promotionId;
                    if (entry.isIntersecting && !viewedPromotionsRef.current.has(promoId)) {
                        const promotion = allPromotions.find(p => p.id === promoId);
                        if (promotion) {
                            pushDataLayer({ ecommerce: null });
                            pushDataLayer({
                                event: 'view_promotion',
                                user_status: isLoggedIn ? 'logged_in' : 'Guest User',
                                ecommerce: {
                                    promotion_id: promotion.id,
                                    promotion_name: promotion.name,
                                    creative_name: promotion.creative,
                                    creative_slot: promotion.slot,
                                }
                            });
                            viewedPromotionsRef.current.add(promoId);
                            observer.unobserve(entry.target);
                        }
                    }
                });
            },
            { threshold: 0.5 }
        );
        
        const promoElements = document.querySelectorAll('[data-is-promo="true"]');
        promoElements.forEach(banner => observer.observe(banner));

        return () => {
            promoElements.forEach(banner => observer.unobserve(banner));
        };
    }, [isDataLoaded]);

    const handlePromotionClick = (promotion) => {
        if (!promotion.isPromo) return;
        pushDataLayer({ ecommerce: null });
        pushDataLayer({
            event: 'select_promotion',
            user_status: isLoggedIn ? 'logged_in' : 'Guest User',
            ecommerce: {
                promotion_id: promotion.id,
                promotion_name: promotion.name,
                creative_name: promotion.creative,
                creative_slot: promotion.slot,
            }
        });
    };

    return (
        <div className="HomePage">
            <section className="HomePage-hero">
                <div className="HomePage-heroText">
                    <h1>Welcome to DFDEZ Store</h1>
                    <p>This is a Website to Test Analytics Implementations.</p>
                    <button>I'm an Analytics Nerd</button>
                </div>
                <div className="HomePage-heroImage">
                    <img src="/images/heros/banner-hero-tools2.webp" alt="Hero Banner Tools" fetchPriority="high"/>
                </div>
            </section>

            <section className="HomePage-productSection">
                <h2>Featured Products</h2>
                <div className="HomePage-productList">
                    {products.map((p, index) => (
                        <Link 
                            to={`/product/${p._id}`} 
                            key={p._id} 
                            className="HomePage-productCard-link"
                            onClick={() => handleItemSelect(p, 'Featured Products', 'featured_products', index)}
                        >
                            <div className="HomePage-productCard">
                                <div className="HomePage-imageContainer">
                                    <img src={p.images[0]} alt={p.name} loading='lazy'/>
                                    <button
                                        className={`HomePage-wishlistButton ${isProductInWishlist(p._id) ? 'active' : ''}`}
                                        onClick={(e) => handleWishlistClick(e, p)}
                                        aria-label="Toggle wishlist"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                    </button>
                                </div>
                                <h3>{p.name}</h3>
                                <p>{p.price} {p.currency}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="HomePage-singleBanner">
                <Link
                    to="/sales"
                    className="HomePage-banner"
                    onClick={() => handlePromotionClick(holyPromoBanner)}
                    data-promotion-id={holyPromoBanner.id}
                    data-is-promo={holyPromoBanner.isPromo}
                >
                    <img src={holyPromoBanner.imageSrc} alt={holyPromoBanner.alt} loading='lazy' />
                </Link>
            </section>

            <VideoSection />

            <section className="HomePage-productSection HomePage-sale">
                <h2>Sale Products</h2>
                <div className="HomePage-productList">
                    {saleProducts.map((p, index) => (
                        <Link 
                            to={`/product/${p._id}`} 
                            key={p._id} 
                            className="HomePage-productCard-link"
                            onClick={() => handleItemSelect(p, 'Sale Products', 'sale_products', index)}
                            state={{
                                isSale: true,
                                originalPrice: p.price,
                                discountPrice: p.discountPrice
                            }}
                        >
                            <div className="HomePage-productCard">
                                <div className="HomePage-imageContainer">
                                    <img src={p.images[0]} alt={p.name} loading='lazy'/>
                                    <button
                                        className={`HomePage-wishlistButton ${isProductInWishlist(p._id) ? 'active' : ''}`}
                                        onClick={(e) => handleWishlistClick(e, p)}
                                        aria-label="Toggle wishlist"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                    </button>
                                </div>
                                <h3>{p.name}</h3>
                                <p>
                                    <span className="HomePage-originalPrice">{p.price.toFixed(2)} {p.currency}</span>
                                    <span className="HomePage-discountPrice">{p.discountPrice.toFixed(2)} {p.currency}</span>
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="HomePage-banners">
                {otherBanners.map(banner => (
                    banner.isPromo ? (
                        <Link
                            to="/sales"
                            key={banner.id}
                            className="HomePage-banner"
                            onClick={() => handlePromotionClick(banner)}
                            data-promotion-id={banner.id}
                            data-is-promo={banner.isPromo}
                        >
                            <img src={banner.imageSrc} alt={banner.alt} loading='lazy' />
                        </Link>
                    ) : (
                        <div
                            key={banner.id}
                            className="HomePage-banner"
                            data-promotion-id={banner.id}
                            data-is-promo={banner.isPromo}
                        >
                            <img src={banner.imageSrc} alt={banner.alt} loading='lazy'/>
                        </div>
                    )
                ))}
            </section>
            
            <Newsletter formLocation="homepage_promo" />
        </div>
    );
};

export default HomePage;

