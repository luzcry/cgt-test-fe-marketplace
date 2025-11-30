import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CartProvider, useCart } from '../context/CartContext';
import ProductPage from '../pages/ProductPage';

const renderProductPage = (productId = 'a') => {
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
  describe('Product A', () => {
    it('renders product name', () => {
      renderProductPage('a');
      expect(screen.getByRole('heading', { name: 'Product A' })).toBeInTheDocument();
    });

    it('renders product price', () => {
      renderProductPage('a');
      expect(screen.getByText('10 USD')).toBeInTheDocument();
    });

    it('renders product image with alt text', () => {
      renderProductPage('a');
      const image = screen.getByRole('img', { name: 'Product A' });
      expect(image).toBeInTheDocument();
    });

    it('renders add to cart button', () => {
      renderProductPage('a');
      expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
    });

    it('renders back link', () => {
      renderProductPage('a');
      expect(screen.getByRole('link', { name: /back to products/i })).toBeInTheDocument();
    });
  });

  describe('Product B', () => {
    it('renders product name', () => {
      renderProductPage('b');
      expect(screen.getByRole('heading', { name: 'Product B' })).toBeInTheDocument();
    });

    it('renders product price', () => {
      renderProductPage('b');
      expect(screen.getByText('30 USD')).toBeInTheDocument();
    });
  });

  describe('Non-existent product', () => {
    it('renders not found message', () => {
      renderProductPage('xyz');
      expect(screen.getByText('Product not found')).toBeInTheDocument();
    });

    it('renders back to home link', () => {
      renderProductPage('xyz');
      expect(screen.getByRole('link', { name: /back to home/i })).toBeInTheDocument();
    });
  });

  describe('Add to cart functionality', () => {
    it('calls addToCart when button is clicked', () => {
      // Create a test component to verify cart state
      const CartDisplay = () => {
        const { cartItems } = useCart();
        return <div data-testid="cart-count">{cartItems.length}</div>;
      };

      render(
        <MemoryRouter initialEntries={['/products/a']}>
          <CartProvider>
            <Routes>
              <Route path="/products/:productId" element={<ProductPage />} />
            </Routes>
            <CartDisplay />
          </CartProvider>
        </MemoryRouter>
      );

      // Initially cart should be empty
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');

      // Click add to cart
      const addButton = screen.getByRole('button', { name: /add to cart/i });
      fireEvent.click(addButton);

      // Cart should now have 1 item
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
        <MemoryRouter initialEntries={['/products/a']}>
          <CartProvider>
            <Routes>
              <Route path="/products/:productId" element={<ProductPage />} />
            </Routes>
            <CartDisplay />
          </CartProvider>
        </MemoryRouter>
      );

      const addButton = screen.getByRole('button', { name: /add to cart/i });

      fireEvent.click(addButton);
      fireEvent.click(addButton);

      // Should still be 1 item (same product)
      expect(screen.getByTestId('cart-items')).toHaveTextContent('1');
      // But count should be 2
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
    });
  });
});
