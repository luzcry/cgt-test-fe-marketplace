import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import { ABTestProvider } from './context/ABTestContext';
import Header from './components/Header';
import CartNotification from './components/CartNotification';
import ErrorBoundary from './components/ErrorBoundary';
import './App.scss';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));

// Lazy load CheckoutPage with its provider to avoid loading checkout code on other pages
const CheckoutPageWithProvider = lazy(() =>
  import(/* webpackChunkName: "checkout" */ './pages/CheckoutPage').then(
    (module) =>
      import(
        /* webpackChunkName: "checkout" */ './context/CheckoutContext'
      ).then(({ CheckoutProvider }) => ({
        default: () => (
          <CheckoutProvider>
            <module.default />
          </CheckoutProvider>
        ),
      }))
  )
);

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
      <ABTestProvider>
        <CartProvider>
          <ErrorBoundary>
            <ScrollToTop />
            <CartNotification />
            <div className="app">
              {/* Skip link for keyboard accessibility */}
              <a href="#main-content" className="app__skip-link">
                Skip to main content
              </a>
              <Header />
              <main id="main-content" className="app__main">
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route
                        path="/products/:productId"
                        element={<ProductPage />}
                      />
                      <Route path="/cart" element={<CartPage />} />
                      <Route
                        path="/checkout"
                        element={<CheckoutPageWithProvider />}
                      />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
              </main>
            </div>
          </ErrorBoundary>
        </CartProvider>
      </ABTestProvider>
    </HelmetProvider>
  );
}

export default App;
