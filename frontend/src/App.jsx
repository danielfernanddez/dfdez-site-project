import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { UserProvider } from './context/UserContext';
import CartProvider from './context/CartContext';
import HomePage from './pages/HomePage';
import Header from "./components/Header";
import Footer from './components/Footer';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ThankYouPage from './pages/ThankYouPage';
import ProfilePage from './pages/ProfilePage';
import ProfileAccountPage from './pages/ProfileAccountPage';
import PageAnalyticsTracker from './components/PageAnalyticsTracker';
import ContactUsPage from './pages/ContactUsPage';
import { WishlistProvider } from './context/WishlistContext';
import WishlistPage from './pages/WishlistPage';
import SalesPage from './pages/SalesPage';
import AddToCartModal from './components/AddToCartModal';

function App() {
  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <WishlistProvider>
          <PageAnalyticsTracker />
          <Header />
          <AddToCartModal />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile-account" element={<ProfileAccountPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              
            </Routes>
          </main>
          <Footer />
          </WishlistProvider>
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

export default App;

