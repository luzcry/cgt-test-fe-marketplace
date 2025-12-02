import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CartProvider, useCart } from '../context/CartContext';
import ProductPage from '../pages/ProductPage';

// Use actual product IDs from the updated product data
const PRODUCT_1_ID = 'cyber-warrior';
const PRODUCT_2_ID = 'hover-bike';

const renderProductPage = (productId = PRODUCT_1_ID) => {
  return render(
    <MemoryRouter initialEntries={[`/products/${productId}`]}>
      <CartProvider>
        <Routes>
          <Route path="/products/:productId" element={<ProductPage />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>
  );
};

describe('ProductPage', () => {
  describe('Cyber Warrior Product', () => {
    it('renders product name', () => {
      renderProductPage(PRODUCT_1_ID);
      expect(screen.getByRole('heading', { name: 'Cyber Warrior' })).toBeInTheDocument();
    });

    it('renders product price', () => {
      renderProductPage(PRODUCT_1_ID);
      expect(screen.getByText('$89')).toBeInTheDocument();
    });

    it('renders product image with alt text', () => {
      renderProductPage(PRODUCT_1_ID);
      const image = screen.getByRole('img', { name: 'Cyber Warrior' });
      expect(image).toBeInTheDocument();
    });

    it('renders add to cart button', () => {
      renderProductPage(PRODUCT_1_ID);
      expect(screen.getByRole('button', { name: /add .+ to cart/i })).toBeInTheDocument();
    });

    it('renders back link', () => {
      renderProductPage(PRODUCT_1_ID);
      expect(screen.getByRole('link', { name: /back to products/i })).toBeInTheDocument();
    });

    it('renders category', () => {
      renderProductPage(PRODUCT_1_ID);
      const categoryBadge = document.querySelector('.product-page__category');
      expect(categoryBadge).toHaveTextContent('Characters');
    });

    it('renders specifications section', () => {
      renderProductPage(PRODUCT_1_ID);
      expect(screen.getByRole('heading', { name: 'Specifications' })).toBeInTheDocument();
    });

    it('renders features section', () => {
      renderProductPage(PRODUCT_1_ID);
      expect(screen.getByRole('heading', { name: /what's included/i })).toBeInTheDocument();
    });
  });

  describe('Hover Bike Product', () => {
    it('renders product name', () => {
      renderProductPage(PRODUCT_2_ID);
      expect(screen.getByRole('heading', { name: 'Hover Bike X-7' })).toBeInTheDocument();
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
      expect(screen.getByRole('button', { name: /back to products/i })).toBeInTheDocument();
    });
  });

  describe('Add to cart functionality', () => {
    it('calls addToCart when button is clicked', () => {
      const CartDisplay = () => {
        const { cartItems } = useCart();
        return <div data-testid="cart-count">{cartItems.length}</div>;
      };

      render(
        <MemoryRouter initialEntries={[`/products/${PRODUCT_1_ID}`]}>
          <CartProvider>
            <Routes>
              <Route path="/products/:productId" element={<ProductPage />} />
            </Routes>
            <CartDisplay />
          </CartProvider>
        </MemoryRouter>
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
        <MemoryRouter initialEntries={[`/products/${PRODUCT_1_ID}`]}>
          <CartProvider>
            <Routes>
              <Route path="/products/:productId" element={<ProductPage />} />
            </Routes>
            <CartDisplay />
          </CartProvider>
        </MemoryRouter>
      );

      const addButton = screen.getByRole('button', { name: /add .+ to cart/i });

      fireEvent.click(addButton);
      fireEvent.click(addButton);

      expect(screen.getByTestId('cart-items')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
    });
  });
});
