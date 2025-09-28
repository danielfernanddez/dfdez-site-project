import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

// Context Providers
import { UserProvider } from './context/UserContext';
import CartProvider from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Core Components
import Header from "./components/Header";
import Footer from './components/Footer';
import PageAnalyticsTracker from './components/PageAnalyticsTracker';
import AddToCartModal from './components/AddToCartModal';

// --- LAZY-LOADED PAGES ---
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const SalesPage = lazy(() => import('./pages/SalesPage'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ProfileAccountPage = lazy(() => import('./pages/ProfileAccountPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ThankYouPage = lazy(() => import('./pages/ThankYouPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));


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
              {/* Suspense provides a fallback UI while lazy components are loading */}
              <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem' }}>Loading...</div>}>
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
              </Suspense>
            </main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

export default App;


