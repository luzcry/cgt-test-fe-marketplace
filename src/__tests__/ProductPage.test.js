import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider, useCart } from '../context/CartContext';
import ProductPage from '../pages/ProductPage';

// Mock ModelViewer component since Three.js requires WebGL
jest.mock('../components/ModelViewer', () => {
  return function MockModelViewer({
    model,
    productName,
    fallbackImage,
    previewColor,
  }) {
    return (
      <div
        data-testid="model-viewer"
        className="model-viewer"
        role="img"
        aria-label={`Interactive 3D model of ${productName}. Use mouse to rotate and zoom.`}
      >
        {fallbackImage && (
          <img
            src={fallbackImage}
            alt={`${productName} preview`}
            data-testid="model-fallback-image"
          />
        )}
        {model && <span data-testid="model-name">{model.name}</span>}
      </div>
    );
  };
});

// Use actual product IDs from the updated product data
const PRODUCT_1_ID = 'tactical-soldier';
const PRODUCT_2_ID = 'expressive-robot';

const renderProductPage = (productId = PRODUCT_1_ID) => {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[`/products/${productId}`]}>
        <CartProvider>
          <Routes>
            <Route path="/products/:productId" element={<ProductPage />} />
          </Routes>
        </CartProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
};

describe('ProductPage', () => {
  // Clear localStorage before each test to prevent cart persistence issues
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Tactical Combat Soldier Product', () => {
    it('renders product name', () => {
      renderProductPage(PRODUCT_1_ID);
      expect(
        screen.getByRole('heading', { name: 'Tactical Combat Soldier' })
      ).toBeInTheDocument();
    });

    it('renders product price', () => {
      renderProductPage(PRODUCT_1_ID);
      expect(screen.getByText('$89')).toBeInTheDocument();
    });

    it('renders 3D model viewer', () => {
      renderProductPage(PRODUCT_1_ID);
      const modelViewer = screen.getByTestId('model-viewer');
      expect(modelViewer).toBeInTheDocument();
    });

    it('renders 3D model name in model viewer', () => {
      renderProductPage(PRODUCT_1_ID);
      const modelName = screen.getByTestId('model-name');
      expect(modelName).toBeInTheDocument();
    });

    it('renders add to cart button', () => {
      renderProductPage(PRODUCT_1_ID);
      expect(
        screen.getByRole('button', { name: /add .+ to cart/i })
      ).toBeInTheDocument();
    });

    it('renders back link', () => {
      renderProductPage(PRODUCT_1_ID);
      expect(
        screen.getByRole('link', { name: /back to products/i })
      ).toBeInTheDocument();
    });

    it('renders category', () => {
      renderProductPage(PRODUCT_1_ID);
      const categoryBadge = document.querySelector('.product-page__category');
      expect(categoryBadge).toHaveTextContent('Characters');
    });

    it('renders specifications section', () => {
      renderProductPage(PRODUCT_1_ID);
      expect(
        screen.getByRole('heading', { name: 'Technical Specifications' })
      ).toBeInTheDocument();
    });

    it('renders features section', () => {
      renderProductPage(PRODUCT_1_ID);
      expect(
        screen.getByRole('heading', { name: /what's included/i })
      ).toBeInTheDocument();
    });
  });

  describe('Expressive Robot Product', () => {
    it('renders product name', () => {
      renderProductPage(PRODUCT_2_ID);
      expect(
        screen.getByRole('heading', { name: 'Expressive Robot Character' })
      ).toBeInTheDocument();
    });

    it('renders product price', () => {
      renderProductPage(PRODUCT_2_ID);
      expect(screen.getByText('$129')).toBeInTheDocument();
    });
  });

  describe('Non-existent product', () => {
    it('renders not found message', () => {
      renderProductPage('xyz');
      expect(screen.getByText('Product Not Found')).toBeInTheDocument();
    });

    it('renders back to products button', () => {
      renderProductPage('xyz');
      expect(
        screen.getByRole('button', { name: /back to products/i })
      ).toBeInTheDocument();
    });
  });

  describe('Add to cart functionality', () => {
    it('calls addToCart when button is clicked', () => {
      const CartDisplay = () => {
        const { cartItems } = useCart();
        return <div data-testid="cart-count">{cartItems.length}</div>;
      };

      render(
        <HelmetProvider>
          <MemoryRouter initialEntries={[`/products/${PRODUCT_1_ID}`]}>
            <CartProvider>
              <Routes>
                <Route path="/products/:productId" element={<ProductPage />} />
              </Routes>
              <CartDisplay />
            </CartProvider>
          </MemoryRouter>
        </HelmetProvider>
      );

      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');

      const addButton = screen.getByRole('button', { name: /add .+ to cart/i });
      fireEvent.click(addButton);

      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    });

    it('increments quantity when adding same product twice', () => {
      const CartDisplay = () => {
        const { cartItems, cartCount } = useCart();
        return (
          <div>
            <div data-testid="cart-items">{cartItems.length}</div>
            <div data-testid="cart-count">{cartCount}</div>
          </div>
        );
      };

      render(
        <HelmetProvider>
          <MemoryRouter initialEntries={[`/products/${PRODUCT_1_ID}`]}>
            <CartProvider>
              <Routes>
                <Route path="/products/:productId" element={<ProductPage />} />
              </Routes>
              <CartDisplay />
            </CartProvider>
          </MemoryRouter>
        </HelmetProvider>
      );

      const addButton = screen.getByRole('button', { name: /add .+ to cart/i });

      fireEvent.click(addButton);
      fireEvent.click(addButton);

      expect(screen.getByTestId('cart-items')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
    });
  });
});
