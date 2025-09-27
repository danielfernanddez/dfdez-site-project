import { useState, useEffect, useRef, useContext } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { UserContext } from '../context/UserContext';
import './ProductDetailPage.css';
import axios from 'axios';
import { mapProductToGA4 } from '../lib/mappers';
import api from '../api/axios';

const AccordionItem = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="ProductDetailPage-accordionItem">
            <button className="ProductDetailPage-accordionTitle" onClick={() => setIsOpen(!isOpen)}>
                <span>{title}</span>
                <span>{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && <div className="ProductDetailPage-accordionContent">{content}</div>}
        </div>
    );
};

const ProductDetailPage = () => {
    const { id: productId } = useParams();
    const location = useLocation();
    const { isSale, originalPrice, discountPrice } = location.state || {};
    
    const { addToCart } = useContext(CartContext);
    const { toggleWishlistItem, isProductInWishlist } = useContext(WishlistContext);
    const { isLoggedIn } = useContext(UserContext);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState('');
    const viewItemPushed = useRef(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setProduct(null);
            viewItemPushed.current = false;
            try {
                setLoading(true);
                const { data } = await api.get(`/api/products/${productId}`);
                setProduct(data);
                if (data.images && data.images.length > 0) {
                    setMainImage(data.images[0]);
                }
                if (data.colorVariants && data.colorVariants.length > 0) {
                    setSelectedColor(data.colorVariants[0].hex);
                }
                setLoading(false);
            } catch (err) {
                setError('Product not found!');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    useEffect(() => {
        if (product && !viewItemPushed.current) {
            const eventPrice = isSale ? discountPrice : product.price;
            const itemForGA4 = {
                ...mapProductToGA4(product),
                price: eventPrice,
                quantity: 1,
            };

            setTimeout(() => {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({ ecommerce: null });
                window.dataLayer.push({
                    event: 'view_item',
                    user_status: isLoggedIn ? 'logged_in' : 'Guest User',
                    ecommerce: {
                        currency: product.currency,
                        value: eventPrice,
                        items: [itemForGA4],
                    }
                });
            }, 0);
            viewItemPushed.current = true;
        }
    }, [product, isSale, discountPrice]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size.');
            return;
        }
        const colorObject = product.colorVariants.find(c => c.hex === selectedColor);
        addToCart(product, selectedSize, colorObject);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!product) return <div>Product not found.</div>;

    return (
        <div className="ProductDetailPage">
            <div className="ProductDetailPage-breadcrumbs">
                <Link to="/">Home</Link> / <Link to="/products">Products</Link> / <span>{product.name}</span>
            </div>
            <div className="ProductDetailPage-mainContent">
                <div className="ProductDetailPage-gallery">
                    <div className="ProductDetailPage-thumbnails">
                        {product.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`${product.name} - view ${index + 1}`}
                                className={mainImage === img ? 'active' : ''}
                                onMouseOver={() => setMainImage(img)}
                            />
                        ))}
                    </div>
                    <div className="ProductDetailPage-mainImage">
                        {isSale && <div className="ProductDetailPage-saleLabel">SALE</div>}
                        <img src={mainImage} alt={product.name} />
                    </div>
                </div>
                <div className="ProductDetailPage-details">
                    <span className="ProductDetailPage-brand">{product.brand}</span>
                    <h1 className="ProductDetailPage-name">{product.name}</h1>
                    
                    {isSale ? (
                        <div className="ProductDetailPage-priceContainer">
                            <span className="ProductDetailPage-originalPrice">€{(originalPrice || 0).toFixed(2)}</span>
                            <span className="ProductDetailPage-discountPrice">€{(discountPrice || 0).toFixed(2)}</span>
                        </div>
                    ) : (
                        <p className="ProductDetailPage-price">{product.currency}{(product.price || 0).toFixed(2)}</p>
                    )}
                    
                    <div className="ProductDetailPage-selector">
                        <p>Colour: <strong>{product.colorVariants.find(c => c.hex === selectedColor)?.name}</strong></p>
                        <div className="ProductDetailPage-colorSwatches">
                            {product.colorVariants.map(color => (
                                <button
                                    key={color.hex}
                                    style={{ backgroundColor: color.hex }}
                                    className={`ProductDetailPage-colorSwatch ${selectedColor === color.hex ? 'selected' : ''}`}
                                    onClick={() => setSelectedColor(color.hex)}
                                    aria-label={`Select color ${color.name}`}
                                ></button>
                            ))}
                        </div>
                    </div>
                    <div className="ProductDetailPage-selector">
                        <div className="ProductDetailPage-sizeButtons">
                            {product.availableSizes.map(size => (
                                <button
                                    key={size}
                                    className={`ProductDetailPage-sizeButton ${selectedSize === size ? 'selected' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="ProductDetailPage-actionContainer">
                        <button className="ProductDetailPage-addToBagButton" onClick={handleAddToCart}>
                            Add to Bag
                        </button>
                        <button 
                            className={`ProductDetailPage-wishlistButton ${isProductInWishlist(product._id) ? 'active' : ''}`}
                            onClick={() => toggleWishlistItem(product)}
                            aria-label="Toggle wishlist"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </button>
                    </div>
                    <div className="ProductDetailPage-deliveryInfo">
                        <p><strong>FREE STANDARD SPAIN DELIVERY</strong> | LIMITED TIME ONLY</p>
                    </div>
                    <div className="ProductDetailPage-accordion">
                        <AccordionItem title="Editor's Notes" content={product.editorNotes} />
                        <AccordionItem title="Size & Fit" content={product.sizeAndFit} />
                        <AccordionItem title="Composition & Care" content={product.compositionAndCare} />
                        <AccordionItem title="Delivery & Returns" content="Details about delivery and returns go here." />
                        <AccordionItem title="Contact" content="Contact details or a link to the contact page." />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
