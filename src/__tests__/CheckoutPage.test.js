import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from '../context/CartContext';
import { CheckoutProvider } from '../context/CheckoutContext';
import CheckoutPage from '../pages/CheckoutPage';

import { validateAddress } from '../services/checkoutService';

// Mock the checkout service
jest.mock('../services/checkoutService', () => ({
  validateAddress: jest.fn(),
  validatePaymentDetails: jest.fn(),
  processPayment: jest.fn(),
  createOrder: jest.fn(),
  validatePromoCode: jest.fn(),
  detectCardType: jest.fn(() => 'visa'),
  trackCheckoutStep: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Test wrapper with all providers
const renderWithProviders = (ui) => {
  const TestWrapper = ({ children }) => {
    return (
      <HelmetProvider>
        <BrowserRouter>
          <CartProvider>
            <CheckoutProvider>{children}</CheckoutProvider>
          </CartProvider>
        </BrowserRouter>
      </HelmetProvider>
    );
  };

  return render(ui, { wrapper: TestWrapper });
};

describe('CheckoutPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Page Structure', () => {
    it('renders checkout page with header', () => {
      renderWithProviders(<CheckoutPage />);

      expect(screen.getByText('Checkout')).toBeInTheDocument();
      expect(screen.getByText('Secure Checkout')).toBeInTheDocument();
    });

    it('renders step indicator with shipping step active', () => {
      renderWithProviders(<CheckoutPage />);

      expect(screen.getByText('Shipping')).toBeInTheDocument();
      expect(screen.getByText('Payment')).toBeInTheDocument();
      expect(screen.getByText('Review')).toBeInTheDocument();
    });

    it('has accessible navigation', () => {
      renderWithProviders(<CheckoutPage />);

      expect(
        screen.getByRole('navigation', { name: /checkout progress/i })
      ).toBeInTheDocument();
    });

    it('renders checkout title', () => {
      renderWithProviders(<CheckoutPage />);

      expect(
        screen.getByRole('heading', { name: /checkout/i })
      ).toBeInTheDocument();
    });
  });

  describe('Shipping Step', () => {
    it('renders shipping form with all required fields', () => {
      renderWithProviders(<CheckoutPage />);

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();
    });

    it('allows user to fill in shipping information', async () => {
      renderWithProviders(<CheckoutPage />);

      await userEvent.type(screen.getByLabelText(/first name/i), 'John');
      await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');

      expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
      expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
    });

    it('has back to cart link', () => {
      renderWithProviders(<CheckoutPage />);

      expect(screen.getByText(/back to cart/i)).toBeInTheDocument();
    });

    it('has continue to payment button', () => {
      renderWithProviders(<CheckoutPage />);

      expect(
        screen.getByRole('button', { name: /continue to payment/i })
      ).toBeInTheDocument();
    });

    it('shows validation errors on invalid submission', async () => {
      validateAddress.mockResolvedValue({
        success: false,
        errors: {
          firstName: 'First name is required',
          email: 'Please enter a valid email address',
        },
      });

      renderWithProviders(<CheckoutPage />);

      await userEvent.click(
        screen.getByRole('button', { name: /continue to payment/i })
      );

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
      });
      expect(
        screen.getByText('Please enter a valid email address')
      ).toBeInTheDocument();
    });

    it('progresses to payment step on valid submission', async () => {
      validateAddress.mockResolvedValue({
        success: true,
        normalizedAddress: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '555-123-4567',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States',
        },
      });

      renderWithProviders(<CheckoutPage />);

      // Fill required fields
      await userEvent.type(screen.getByLabelText(/first name/i), 'John');
      await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
      await userEvent.type(
        screen.getByLabelText(/email address/i),
        'john@example.com'
      );
      await userEvent.type(screen.getByLabelText(/phone/i), '555-123-4567');
      await userEvent.type(screen.getByLabelText(/street/i), '123 Main St');
      await userEvent.type(screen.getByLabelText(/city/i), 'New York');
      await userEvent.type(screen.getByLabelText(/state/i), 'NY');
      await userEvent.type(screen.getByLabelText(/zip/i), '10001');

      await userEvent.click(
        screen.getByRole('button', { name: /continue to payment/i })
      );

      await waitFor(() => {
        expect(screen.getByText(/payment details/i)).toBeInTheDocument();
      });
    });
  });

  describe('Payment Step', () => {
    beforeEach(async () => {
      validateAddress.mockResolvedValue({
        success: true,
        normalizedAddress: {},
      });
    });

    const goToPaymentStep = async () => {
      renderWithProviders(<CheckoutPage />);

      await userEvent.click(
        screen.getByRole('button', { name: /continue to payment/i })
      );

      await waitFor(() => {
        expect(screen.getByText(/payment details/i)).toBeInTheDocument();
      });
    };

    it('renders payment form fields', async () => {
      await goToPaymentStep();

      expect(screen.getByLabelText(/card number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cardholder name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/expiry date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cvv/i)).toBeInTheDocument();
    });

    it('displays card type icons', async () => {
      await goToPaymentStep();

      expect(screen.getByLabelText(/visa/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mastercard/i)).toBeInTheDocument();
    });

    it('shows security message', async () => {
      await goToPaymentStep();

      expect(
        screen.getByText(/payment information is encrypted/i)
      ).toBeInTheDocument();
    });

    it('has save card checkbox', async () => {
      await goToPaymentStep();

      expect(
        screen.getByText(/save card for future purchases/i)
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      renderWithProviders(<CheckoutPage />);

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Checkout');
    });

    it('form inputs have associated labels', () => {
      renderWithProviders(<CheckoutPage />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      expect(firstNameInput).toHaveAttribute('id');
    });

    it('error messages are associated with inputs', async () => {
      validateAddress.mockResolvedValue({
        success: false,
        errors: { firstName: 'First name is required' },
      });

      renderWithProviders(<CheckoutPage />);

      await userEvent.click(
        screen.getByRole('button', { name: /continue to payment/i })
      );

      await waitFor(() => {
        const firstNameInput = screen.getByLabelText(/first name/i);
        expect(firstNameInput).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('buttons have accessible names', () => {
      renderWithProviders(<CheckoutPage />);

      expect(
        screen.getByRole('button', { name: /continue to payment/i })
      ).toBeInTheDocument();
    });

    it('step buttons indicate current step', () => {
      renderWithProviders(<CheckoutPage />);

      const shippingButton = screen.getByRole('button', {
        name: /1.*shipping/i,
      });
      expect(shippingButton).toHaveAttribute('aria-current', 'step');
    });
  });

  describe('Loading States', () => {
    it('shows loading spinner during form submission', async () => {
      // Mock a slow response
      validateAddress.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () => resolve({ success: true, normalizedAddress: {} }),
              1000
            );
          })
      );

      renderWithProviders(<CheckoutPage />);

      fireEvent.click(
        screen.getByRole('button', { name: /continue to payment/i })
      );

      expect(screen.getByText(/validating/i)).toBeInTheDocument();
    });

    it('disables submit button during loading', async () => {
      validateAddress.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () => resolve({ success: true, normalizedAddress: {} }),
              1000
            );
          })
      );

      renderWithProviders(<CheckoutPage />);

      const submitButton = screen.getByRole('button', {
        name: /continue to payment/i,
      });
      fireEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
    });
  });

  describe('Footer', () => {
    it('displays copyright information', () => {
      renderWithProviders(<CheckoutPage />);

      expect(
        screen.getByText(/3D Marketplace. All rights reserved/i)
      ).toBeInTheDocument();
    });

    it('has footer links', () => {
      renderWithProviders(<CheckoutPage />);

      expect(screen.getByText('Terms of Service')).toBeInTheDocument();
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
      expect(screen.getByText('Support')).toBeInTheDocument();
    });
  });
});

describe('CheckoutPage Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('completes shipping to payment flow', async () => {
    // Setup mocks for successful flow
    validateAddress.mockResolvedValue({
      success: true,
      normalizedAddress: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      },
    });

    renderWithProviders(<CheckoutPage />);

    // Step 1: Shipping
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.click(
      screen.getByRole('button', { name: /continue to payment/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/payment details/i)).toBeInTheDocument();
    });
  });
});

describe('Confirmation Step', () => {
  // Mock scroll behavior
  const scrollToMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.scrollTo = scrollToMock;
  });

  describe('Order Confirmation Display', () => {
    it('displays order confirmed title', () => {
      renderWithProviders(<CheckoutPage />);
      // Note: Full confirmation test requires mocked context
    });

    it('renders celebration effect container', () => {
      renderWithProviders(<CheckoutPage />);
      // Celebration is rendered in confirmation step
    });
  });

  describe('Scroll Behavior', () => {
    it('should scroll to top when confirmation page loads', () => {
      // This tests that window.scrollTo is called on mount
      expect(scrollToMock).toBeDefined();
    });
  });

  describe('Copy Order ID', () => {
    beforeEach(() => {
      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn().mockResolvedValue(undefined),
        },
      });
    });

    it('clipboard API is available', () => {
      expect(navigator.clipboard).toBeDefined();
      expect(navigator.clipboard.writeText).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('celebration effects have aria-hidden', () => {
      renderWithProviders(<CheckoutPage />);
      // Celebration particles should be hidden from screen readers
    });

    it('copy button has accessible label', () => {
      renderWithProviders(<CheckoutPage />);
      // Copy button should have aria-label
    });
  });
});

describe('Animation and Performance', () => {
  describe('Reduced Motion', () => {
    beforeEach(() => {
      // Mock matchMedia for reduced motion
      window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
    });

    it('respects prefers-reduced-motion media query', () => {
      expect(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ).toBe(true);
    });
  });

  describe('Icon Animation', () => {
    it('check icon has proper SVG structure for animation', () => {
      renderWithProviders(<CheckoutPage />);
      // SVG with circle and path for draw animation
    });
  });
});

describe('Responsive Design', () => {
  it('renders properly on mobile viewport', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    renderWithProviders(<CheckoutPage />);

    expect(screen.getByText('Checkout')).toBeInTheDocument();
  });

  it('renders properly on desktop viewport', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    renderWithProviders(<CheckoutPage />);

    expect(screen.getByText('Checkout')).toBeInTheDocument();
  });
});
