import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./Header.css";

const Header = () => {
  const { isLoggedIn } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`Header ${isScrolled ? 'Header-scrolled' : ''}`}>
      <nav className="Header-navContainer">
        <div className="Header-navLeft">
          <Link to="/" className="Header-logo">dfdez store</Link>
          <div className="Header-desktopLinks">
            <Link to="/products" className="Header-navLink">Products</Link>
            <Link to="/sales" className="Header-navLink">Sales</Link>
            <Link to="/contact" className="Header-navLink">Contact Us</Link>
          </div>
        </div>

        <div className="Header-navRight Header-desktopLinks">
          <Link to="/wishlist" className="Header-navLink">Wishlist</Link>
          <Link to="/cart" className="Header-navLink">Cart</Link>
          <Link to={isLoggedIn ? "/profile-account" : "/profile"} className="Header-navLink">{isLoggedIn ? "My Account" : "Login"}</Link>
        </div>

        <button
          className={`Header-hamburgerMenu ${isMenuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="Header-line"></span>
          <span className="Header-line"></span>
          <span className="Header-line"></span>
        </button>
      </nav>

      <div className={`Header-mobileMenu ${isMenuOpen ? "open" : ""}`}>
        <img className="Header-dfdez-mobile" src="/images/heros/dfdez-mobile-preview.png" alt="dfdez-mobile" loading='lazy'/>
        <Link to="/" className="Header-navLink" onClick={toggleMenu}>Home</Link>
        <Link to="/products" className="Header-navLink" onClick={toggleMenu}>Products</Link>
        <Link to="/sales" className="Header-navLink" onClick={toggleMenu}>Sales</Link>
        <Link to="/contact" className="Header-navLink" onClick={toggleMenu}>Contact Us</Link>
        <Link to="/wishlist" className="Header-navLink" onClick={toggleMenu}>Wishlist</Link>
        <Link to="/cart" className="Header-navLink" onClick={toggleMenu}>Cart</Link>
        <Link to={isLoggedIn ? "/profile-account" : "/profile"} className="Header-navLink" onClick={toggleMenu}>{isLoggedIn ? "My Account" : "Login"}</Link>
      </div>
    </header>
  );
};

export default Header;





