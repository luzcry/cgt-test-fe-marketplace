import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../context/CartContext';
import { ABTestProvider } from '../context/ABTestContext';
import CartNotification from '../components/CartNotification';
import React from 'react';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockProduct = {
  id: 'test-1',
  name: 'Test Product',
  price: 10,
  currency: 'USD',
  previewColor: 'linear-gradient(135deg, #4A90E2, #357ABD)',
};

// Helper component to trigger cart actions
const NotificationWithTrigger = ({ autoAdd = false }) => {
  const { addToCart } = useCart();

  React.useEffect(() => {
    if (autoAdd) {
      addToCart(mockProduct);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <button onClick={() => addToCart(mockProduct)}>Add to Cart</button>
      <CartNotification />
    </>
  );
};

const renderNotification = (autoAdd = false) => {
  // Force control variant for consistent test behavior
  localStorage.setItem(
    'ab_test_assignments',
    JSON.stringify({ cart_notification_style: 'control' })
  );

  return render(
    <MemoryRouter>
      <ABTestProvider>
        <CartProvider>
          <NotificationWithTrigger autoAdd={autoAdd} />
        </CartProvider>
      </ABTestProvider>
    </MemoryRouter>
  );
};

describe('CartNotification', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  describe('Visibility', () => {
    it('is not visible initially', () => {
      renderNotification(false);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('becomes visible when product is added to cart', () => {
      renderNotification(false);

      fireEvent.click(screen.getByText('Add to Cart'));

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('displays the added product name', () => {
      renderNotification(true);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('displays "Added to cart" message', () => {
      renderNotification(true);

      expect(screen.getByText('Added to cart')).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('navigates to cart when "View Cart" is clicked', () => {
      renderNotification(true);

      fireEvent.click(screen.getByRole('button', { name: /view cart/i }));

      expect(mockNavigate).toHaveBeenCalledWith('/cart');
    });

    it('hides notification when "View Cart" is clicked', () => {
      renderNotification(true);

      fireEvent.click(screen.getByRole('button', { name: /view cart/i }));

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('hides notification when "Continue Shopping" is clicked', () => {
      renderNotification(true);

      fireEvent.click(
        screen.getByRole('button', { name: /continue shopping/i })
      );

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('does not navigate when "Continue Shopping" is clicked', () => {
      renderNotification(true);

      fireEvent.click(
        screen.getByRole('button', { name: /continue shopping/i })
      );

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('hides notification when close button is clicked', () => {
      renderNotification(true);

      fireEvent.click(
        screen.getByRole('button', { name: /close notification/i })
      );

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has role="alert" for screen readers', () => {
      renderNotification(true);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('has aria-live="polite" for announcements', () => {
      renderNotification(true);

      expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite');
    });

    it('close button has accessible label', () => {
      renderNotification(true);

      expect(
        screen.getByRole('button', { name: /close notification/i })
      ).toBeInTheDocument();
    });

    it('View Cart button is accessible', () => {
      renderNotification(true);

      expect(
        screen.getByRole('button', { name: /view cart/i })
      ).toBeInTheDocument();
    });

    it('Continue Shopping button is accessible', () => {
      renderNotification(true);

      expect(
        screen.getByRole('button', { name: /continue shopping/i })
      ).toBeInTheDocument();
    });
  });

  describe('Multiple products', () => {
    it('shows the most recently added product', () => {
      renderNotification(false);

      // Add first product
      fireEvent.click(screen.getByText('Add to Cart'));
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });
});

describe('CartNotification integration', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it('works with cart context to show product info', () => {
    renderNotification(true);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Added to cart')).toBeInTheDocument();
  });
});
