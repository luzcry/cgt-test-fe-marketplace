import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import './App.scss';

function App() {
  return (
    <CartProvider>
      <div className="app">
        {/* Skip link for keyboard accessibility */}
        <a href="#main-content" className="app__skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="app__main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:productId" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>
      </div>
    </CartProvider>
  );
}

export default App;
