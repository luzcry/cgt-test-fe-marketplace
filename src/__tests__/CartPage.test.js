import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../context/CartContext';
import CartPage from '../pages/CartPage';
import React from 'react';

const mockProduct = {
  id: 'a',
  name: 'Product A',
  price: 10,
  currency: 'USD',
  image: 'test-image.jpg',
  category: 'Digital Asset',
  previewColor: 'linear-gradient(135deg, #4A90E2, #357ABD)',
};

const mockProduct2 = {
  id: 'b',
  name: 'Product B',
  price: 30,
  currency: 'USD',
  image: 'test-image-b.jpg',
  category: 'Premium Asset',
  previewColor: 'linear-gradient(135deg, #E94B8A, #C73E75)',
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
      // Price appears in item and summary, check item price specifically
      const itemPrice = document.querySelector('.cart-item__price');
      expect(itemPrice).toHaveTextContent('$10.00');
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
      // Find subtotal value in the summary
      const summaryLines = document.querySelectorAll('.cart-page__summary-line');
      const subtotalLine = summaryLines[0]; // First line is subtotal
      expect(subtotalLine).toHaveTextContent('$10.00');
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
  });
});
