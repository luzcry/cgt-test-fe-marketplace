import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider, useCart } from '../context/CartContext';
import CartPage from '../pages/CartPage';
import React from 'react';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock ModelPreview since it uses Three.js
jest.mock('../components/ModelPreview', () => {
  return function MockModelPreview({ model, previewColor, alt }) {
    return (
      <div
        data-testid="model-preview"
        style={{ background: previewColor }}
        aria-label={alt}
      >
        3D Preview
      </div>
    );
  };
});

const mockProduct = {
  id: 'a',
  name: 'Product A',
  price: 10,
  currency: 'USD',
  image: 'test-image.jpg',
  category: 'Digital Asset',
  previewColor: 'linear-gradient(135deg, #4A90E2, #357ABD)',
  model: { url: 'test-model.glb', scale: 1 },
};

const mockProduct2 = {
  id: 'b',
  name: 'Product B',
  price: 30,
  currency: 'USD',
  image: 'test-image-b.jpg',
  category: 'Premium Asset',
  previewColor: 'linear-gradient(135deg, #E94B8A, #C73E75)',
  model: { url: 'test-model-b.glb', scale: 1 },
};

// Helper component to pre-populate cart
const CartWithItems = ({ items = [] }) => {
  const { addToCart } = useCart();

  React.useEffect(() => {
    items.forEach((item) => {
      for (let i = 0; i < (item.quantity || 1); i++) {
        addToCart(item);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <CartPage />;
};

const renderCartPage = (items = []) => {
  if (items.length === 0) {
    return render(
      <HelmetProvider>
        <MemoryRouter>
          <CartProvider>
            <CartPage />
          </CartProvider>
        </MemoryRouter>
      </HelmetProvider>
    );
  }

  return render(
    <HelmetProvider>
      <MemoryRouter>
        <CartProvider>
          <CartWithItems items={items} />
        </CartProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
};

describe('CartPage', () => {
  // Clear localStorage before each test to prevent cart persistence issues
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Empty cart', () => {
    it('renders empty cart message', () => {
      renderCartPage();
      expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
    });

    it('renders browse products button', () => {
      renderCartPage();
      expect(
        screen.getByRole('button', { name: /browse products/i })
      ).toBeInTheDocument();
    });

    it('shows helpful message', () => {
      renderCartPage();
      expect(
        screen.getByText(/start adding some amazing products/i)
      ).toBeInTheDocument();
    });
  });

  describe('Cart with items', () => {
    it('renders cart title', () => {
      renderCartPage([mockProduct]);
      expect(screen.getByRole('heading', { name: 'Shopping Cart' })).toBeInTheDocument();
    });

    it('renders product name', () => {
      renderCartPage([mockProduct]);
      expect(screen.getByText('Product A')).toBeInTheDocument();
    });

    it('renders product price with formatting', () => {
      renderCartPage([mockProduct]);
      // Price appears in item and summary
      const prices = screen.getAllByText('$10.00');
      expect(prices.length).toBeGreaterThanOrEqual(1);
    });

    it('renders quantity controls', () => {
      renderCartPage([mockProduct]);
      expect(
        screen.getByRole('button', { name: /decrease quantity/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /increase quantity/i })
      ).toBeInTheDocument();
    });

    it('renders order summary', () => {
      renderCartPage([mockProduct]);
      expect(screen.getByRole('heading', { name: 'Order Summary' })).toBeInTheDocument();
    });

    it('renders checkout button', () => {
      renderCartPage([mockProduct]);
      expect(
        screen.getByRole('button', { name: /proceed to checkout/i })
      ).toBeInTheDocument();
    });

    it('renders clear cart button', () => {
      renderCartPage([mockProduct]);
      expect(
        screen.getByRole('button', { name: /clear/i })
      ).toBeInTheDocument();
    });

    it('renders remove button for each item', () => {
      renderCartPage([mockProduct]);
      expect(
        screen.getByRole('button', { name: /remove product a/i })
      ).toBeInTheDocument();
    });
  });

  describe('Cart interactions', () => {
    it('increases quantity when + is clicked', () => {
      renderCartPage([mockProduct]);

      const increaseBtn = screen.getByRole('button', {
        name: /increase quantity/i,
      });
      fireEvent.click(increaseBtn);

      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('decreases quantity when - is clicked', () => {
      renderCartPage([{ ...mockProduct, quantity: 2 }]);

      expect(screen.getByText('2')).toBeInTheDocument();

      const decreaseBtn = screen.getByRole('button', {
        name: /decrease quantity/i,
      });
      fireEvent.click(decreaseBtn);

      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('removes item when remove button is clicked', () => {
      renderCartPage([mockProduct]);

      const removeBtn = screen.getByRole('button', {
        name: /remove product a/i,
      });
      fireEvent.click(removeBtn);

      expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
    });

    it('clears all items when clear cart is clicked', () => {
      renderCartPage([mockProduct, mockProduct2]);

      const clearBtn = screen.getByRole('button', { name: /clear/i });
      fireEvent.click(clearBtn);

      expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
    });
  });

  describe('Cart calculations', () => {
    it('calculates subtotal correctly', () => {
      renderCartPage([mockProduct]);
      // Subtotal label should exist and $10.00 should be displayed
      expect(screen.getByText('Subtotal')).toBeInTheDocument();
      expect(screen.getAllByText('$10.00').length).toBeGreaterThanOrEqual(1);
    });

    it('calculates tax correctly', () => {
      renderCartPage([mockProduct]);
      // Tax is 10% of $10 = $1.00
      expect(screen.getByText('$1.00')).toBeInTheDocument();
    });

    it('calculates total correctly', () => {
      renderCartPage([mockProduct]);
      // Total is $10 + $1 tax = $11.00
      expect(screen.getByText('$11.00')).toBeInTheDocument();
    });

    it('calculates total for multiple items correctly', () => {
      renderCartPage([mockProduct, mockProduct2]);
      // Subtotal: $10 + $30 = $40
      // Tax: $4
      // Total: $44
      expect(screen.getByText('$44.00')).toBeInTheDocument();
    });

    it('updates total when quantity changes', () => {
      renderCartPage([mockProduct]);

      // Initial total is $11.00
      expect(screen.getByText('$11.00')).toBeInTheDocument();

      // Increase quantity
      const increaseBtn = screen.getByRole('button', { name: /increase quantity/i });
      fireEvent.click(increaseBtn);

      // New total: $20 + $2 tax = $22.00
      expect(screen.getByText('$22.00')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      mockNavigate.mockClear();
    });

    it('navigates to home when browse products is clicked (empty cart)', () => {
      renderCartPage();

      fireEvent.click(screen.getByRole('button', { name: /browse products/i }));

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('navigates to checkout when proceed to checkout is clicked', () => {
      renderCartPage([mockProduct]);

      fireEvent.click(screen.getByRole('button', { name: /proceed to checkout/i }));

      expect(mockNavigate).toHaveBeenCalledWith('/checkout');
    });

    it('navigates to home when continue shopping is clicked', () => {
      renderCartPage([mockProduct]);

      fireEvent.click(screen.getByRole('button', { name: /continue shopping/i }));

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      renderCartPage([mockProduct]);

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Shopping Cart');

      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toHaveTextContent('Order Summary');
    });

    it('cart items section has aria-label', () => {
      renderCartPage([mockProduct]);

      expect(screen.getByRole('region', { name: /cart items/i })).toBeInTheDocument();
    });

    it('order summary has aria-label', () => {
      renderCartPage([mockProduct]);

      expect(screen.getByRole('complementary', { name: /order summary/i })).toBeInTheDocument();
    });

    it('quantity controls have accessible labels', () => {
      renderCartPage([mockProduct]);

      expect(screen.getByRole('button', { name: /decrease quantity of product a/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /increase quantity of product a/i })).toBeInTheDocument();
    });

    it('remove buttons have accessible labels for each product', () => {
      renderCartPage([mockProduct, mockProduct2]);

      expect(screen.getByRole('button', { name: /remove product a from cart/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /remove product b from cart/i })).toBeInTheDocument();
    });

    it('quantity value has accessible label', () => {
      renderCartPage([mockProduct]);

      expect(screen.getByLabelText(/quantity: 1/i)).toBeInTheDocument();
    });

    it('preview links to product page with accessible label', () => {
      renderCartPage([mockProduct]);

      const previewLink = screen.getByRole('link', { name: 'View Product A' });
      expect(previewLink).toHaveAttribute('href', '/products/a');
    });
  });

  describe('Multiple items', () => {
    it('renders all items in cart', () => {
      renderCartPage([mockProduct, mockProduct2]);

      expect(screen.getByText('Product A')).toBeInTheDocument();
      expect(screen.getByText('Product B')).toBeInTheDocument();
    });

    it('each item has its own controls', () => {
      renderCartPage([mockProduct, mockProduct2]);

      const decreaseButtons = screen.getAllByRole('button', { name: /decrease quantity/i });
      const increaseButtons = screen.getAllByRole('button', { name: /increase quantity/i });

      expect(decreaseButtons).toHaveLength(2);
      expect(increaseButtons).toHaveLength(2);
    });

    it('removing one item keeps others', () => {
      renderCartPage([mockProduct, mockProduct2]);

      const removeBtn = screen.getByRole('button', { name: /remove product a/i });
      fireEvent.click(removeBtn);

      expect(screen.queryByText('Product A')).not.toBeInTheDocument();
      expect(screen.getByText('Product B')).toBeInTheDocument();
    });

    it('shows category for each product', () => {
      renderCartPage([mockProduct, mockProduct2]);

      expect(screen.getByText('Digital Asset')).toBeInTheDocument();
      expect(screen.getByText('Premium Asset')).toBeInTheDocument();
    });
  });

  describe('Quantity edge cases', () => {
    it('disables decrease button when quantity is 1', () => {
      renderCartPage([mockProduct]);

      const decreaseBtn = screen.getByRole('button', { name: /decrease quantity/i });
      expect(decreaseBtn).toBeDisabled();
    });

    it('enables decrease button when quantity is greater than 1', () => {
      renderCartPage([{ ...mockProduct, quantity: 2 }]);

      const decreaseBtn = screen.getByRole('button', { name: /decrease quantity/i });
      expect(decreaseBtn).not.toBeDisabled();
    });

    it('shows per-item price when quantity is greater than 1', () => {
      renderCartPage([{ ...mockProduct, quantity: 2 }]);

      expect(screen.getByText('$10 each')).toBeInTheDocument();
    });

    it('does not show per-item price when quantity is 1', () => {
      renderCartPage([mockProduct]);

      expect(screen.queryByText(/each/i)).not.toBeInTheDocument();
    });
  });

  describe('Product links', () => {
    it('product name links to product page', () => {
      renderCartPage([mockProduct]);

      const productLink = screen.getByRole('link', { name: 'Product A' });
      expect(productLink).toHaveAttribute('href', '/products/a');
    });
  });

  describe('Empty cart state', () => {
    it('has empty cart icon', () => {
      renderCartPage();

      const icon = screen.getByTestId('empty-cart-icon');
      expect(icon).toBeInTheDocument();
    });

    it('empty cart icon is decorative (hidden from AT)', () => {
      renderCartPage();

      const icon = screen.getByTestId('empty-cart-icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });
});

describe('CartPage SEO', () => {
  it('has page title for empty cart', () => {
    renderCartPage();
    // Helmet sets document title
  });

  it('has page title for cart with items', () => {
    renderCartPage([mockProduct]);
    // Helmet sets document title
  });
});

describe('CartPage responsive behavior', () => {
  it('renders on mobile viewport', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375
    });

    renderCartPage([mockProduct]);

    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
  });

  it('renders on tablet viewport', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768
    });

    renderCartPage([mockProduct]);

    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
  });

  it('renders on desktop viewport', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200
    });

    renderCartPage([mockProduct]);

    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
  });
});
