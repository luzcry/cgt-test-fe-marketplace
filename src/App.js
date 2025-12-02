import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import { CheckoutProvider } from './context/CheckoutContext';
import Header from './components/Header';
import CartNotification from './components/CartNotification';
import './App.scss';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));

// Minimal loading fallback
function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader__spinner" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <HelmetProvider>
      <CartProvider>
        <CheckoutProvider>
          <ScrollToTop />
          <CartNotification />
          <div className="app">
            {/* Skip link for keyboard accessibility */}
            <a href="#main-content" className="app__skip-link">
              Skip to main content
            </a>
            <Header />
            <main id="main-content" className="app__main">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products/:productId" element={<ProductPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </CheckoutProvider>
      </CartProvider>
    </HelmetProvider>
  );
}

export default App;
