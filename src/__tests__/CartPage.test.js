import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../context/CartContext';
import CartPage from '../pages/CartPage';

const mockProduct = {
  id: 'a',
  name: 'Product A',
  price: 10,
  currency: 'USD',
  image: 'test-image.jpg',
};

const mockProduct2 = {
  id: 'b',
  name: 'Product B',
  price: 30,
  currency: 'USD',
  image: 'test-image-b.jpg',
};

// Helper component to pre-populate cart
const CartWithItems = ({ items = [] }) => {
  const { addToCart } = useCart();

  // Add items on mount
  React.useEffect(() => {
    items.forEach((item) => {
      for (let i = 0; i < (item.quantity || 1); i++) {
        addToCart(item);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <CartPage />;
};

// Need to import React for the helper component
import React from 'react';

const renderCartPage = (items = []) => {
  if (items.length === 0) {
    return render(
      <MemoryRouter>
        <CartProvider>
          <CartPage />
        </CartProvider>
      </MemoryRouter>
    );
  }

  return render(
    <MemoryRouter>
      <CartProvider>
        <CartWithItems items={items} />
      </CartProvider>
    </MemoryRouter>
  );
};

describe('CartPage', () => {
  describe('Empty cart', () => {
    it('renders empty cart message', () => {
      renderCartPage();
      expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
    });

    it('renders continue shopping link', () => {
      renderCartPage();
      expect(
        screen.getByRole('link', { name: /continue shopping/i })
      ).toHaveAttribute('href', '/');
    });

    it('shows helpful message', () => {
      renderCartPage();
      expect(
        screen.getByText(/haven't added anything/i)
      ).toBeInTheDocument();
    });
  });

  describe('Cart with items', () => {
    it('renders cart title', () => {
      renderCartPage([mockProduct]);
      expect(screen.getByRole('heading', { name: 'Your Cart' })).toBeInTheDocument();
    });

    it('renders product name', () => {
      renderCartPage([mockProduct]);
      expect(screen.getByText('Product A')).toBeInTheDocument();
    });

    it('renders product price', () => {
      renderCartPage([mockProduct]);
      // Price appears multiple times (item price, subtotal, total)
      const priceElements = screen.getAllByText('10 USD');
      expect(priceElements.length).toBeGreaterThanOrEqual(1);
    });

    it('renders product image', () => {
      renderCartPage([mockProduct]);
      expect(screen.getByRole('img', { name: 'Product A' })).toBeInTheDocument();
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

    it('renders cart total', () => {
      renderCartPage([mockProduct]);
      // Check for total label and amount
      expect(screen.getByText('Total:')).toBeInTheDocument();
      const totalAmount = screen.getByText('10 USD', {
        selector: '.cart-page__total-amount',
      });
      expect(totalAmount).toBeInTheDocument();
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
        screen.getByRole('button', { name: /clear cart/i })
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

      // Quantity should now be 2
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('decreases quantity when - is clicked', () => {
      renderCartPage([{ ...mockProduct, quantity: 2 }]);

      // Wait for cart to populate
      expect(screen.getByText('2')).toBeInTheDocument();

      const decreaseBtn = screen.getByRole('button', {
        name: /decrease quantity/i,
      });
      fireEvent.click(decreaseBtn);

      // Quantity should now be 1
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('removes item when quantity reaches 0', () => {
      renderCartPage([mockProduct]);

      const decreaseBtn = screen.getByRole('button', {
        name: /decrease quantity/i,
      });
      fireEvent.click(decreaseBtn);

      // Should show empty cart
      expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
    });

    it('removes item when remove button is clicked', () => {
      renderCartPage([mockProduct]);

      const removeBtn = screen.getByRole('button', {
        name: /remove product a/i,
      });
      fireEvent.click(removeBtn);

      // Should show empty cart
      expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
    });

    it('clears all items when clear cart is clicked', () => {
      renderCartPage([mockProduct, mockProduct2]);

      const clearBtn = screen.getByRole('button', { name: /clear cart/i });
      fireEvent.click(clearBtn);

      // Should show empty cart
      expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
    });
  });

  describe('Cart calculations', () => {
    it('calculates correct total for single item', () => {
      renderCartPage([mockProduct]);
      // Total should show in summary
      expect(screen.getAllByText('10 USD').length).toBeGreaterThan(0);
    });

    it('calculates subtotal correctly', () => {
      renderCartPage([{ ...mockProduct, quantity: 3 }]);

      // Subtotal for 3 items at $10 each = $30 (appears in subtotal and total)
      const priceElements = screen.getAllByText('30 USD');
      expect(priceElements.length).toBeGreaterThanOrEqual(1);
    });
  });
});
