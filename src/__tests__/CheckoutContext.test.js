import { renderHook, act, waitFor } from '@testing-library/react';
import {
  CheckoutProvider,
  useCheckout,
  useCheckoutState,
  useCheckoutActions,
  CHECKOUT_STEPS,
} from '../context/CheckoutContext';
import { CartProvider } from '../context/CartContext';

import {
  validateAddress,
  validatePaymentDetails,
  processPayment,
  createOrder,
  validatePromoCode,
} from '../services/checkoutService';

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

// Wrapper component for hooks
const AllProviders = ({ children }) => (
  <CartProvider>
    <CheckoutProvider>{children}</CheckoutProvider>
  </CartProvider>
);

describe('CheckoutContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useCheckout hook', () => {
    it('throws error when used outside CheckoutProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // useCheckout internally calls useCheckoutState first
      expect(() => {
        renderHook(() => useCheckout());
      }).toThrow('useCheckoutState must be used within a CheckoutProvider');

      consoleSpy.mockRestore();
    });

    it('provides initial state', () => {
      const { result } = renderHook(() => useCheckout(), {
        wrapper: AllProviders,
      });

      expect(result.current.currentStep).toBe(CHECKOUT_STEPS.SHIPPING);
      expect(result.current.completedSteps).toEqual([]);
      expect(result.current.shippingInfo).toBeDefined();
      expect(result.current.paymentInfo).toBeDefined();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.errors).toEqual({});
    });
  });

  describe('useCheckoutState hook', () => {
    it('throws error when used outside CheckoutProvider', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useCheckoutState());
      }).toThrow('useCheckoutState must be used within a CheckoutProvider');

      consoleSpy.mockRestore();
    });

    it('provides state without actions', () => {
      const { result } = renderHook(() => useCheckoutState(), {
        wrapper: AllProviders,
      });

      expect(result.current.currentStep).toBe(CHECKOUT_STEPS.SHIPPING);
      expect(result.current.totals).toBeDefined();
      expect(result.current.goToStep).toBeUndefined();
    });
  });

  describe('useCheckoutActions hook', () => {
    it('throws error when used outside CheckoutProvider', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useCheckoutActions());
      }).toThrow('useCheckoutActions must be used within a CheckoutProvider');

      consoleSpy.mockRestore();
    });

    it('provides actions without state', () => {
      const { result } = renderHook(() => useCheckoutActions(), {
        wrapper: AllProviders,
      });

      expect(result.current.goToStep).toBeDefined();
      expect(result.current.updateShippingInfo).toBeDefined();
      expect(result.current.currentStep).toBeUndefined();
    });
  });

  describe('Shipping Information', () => {
    it('updates shipping info fields', () => {
      const { result } = renderHook(() => useCheckout(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.updateShippingInfo('firstName', 'John');
        result.current.updateShippingInfo('lastName', 'Doe');
        result.current.updateShippingInfo('email', 'john@example.com');
      });

      expect(result.current.shippingInfo.firstName).toBe('John');
      expect(result.current.shippingInfo.lastName).toBe('Doe');
      expect(result.current.shippingInfo.email).toBe('john@example.com');
    });

    it('submits valid shipping info and moves to next step', async () => {
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

      const { result } = renderHook(() => useCheckout(), {
        wrapper: AllProviders,
      });

      // Fill in shipping info
      act(() => {
        result.current.updateShippingInfo('firstName', 'John');
        result.current.updateShippingInfo('lastName', 'Doe');
        result.current.updateShippingInfo('email', 'john@example.com');
        result.current.updateShippingInfo('phone', '555-123-4567');
        result.current.updateShippingInfo('street', '123 Main St');
        result.current.updateShippingInfo('city', 'New York');
        result.current.updateShippingInfo('state', 'NY');
        result.current.updateShippingInfo('zipCode', '10001');
      });

      await act(async () => {
        await result.current.submitShippingInfo();
      });

      await waitFor(() => {
        expect(result.current.currentStep).toBe(CHECKOUT_STEPS.PAYMENT);
      });
      expect(result.current.completedSteps).toContain(CHECKOUT_STEPS.SHIPPING);
    });

    it('shows validation errors for invalid shipping info', async () => {
      validateAddress.mockResolvedValue({
        success: false,
        errors: {
          firstName: 'First name is required',
          email: 'Please enter a valid email address',
        },
      });

      const { result } = renderHook(() => useCheckout(), {
        wrapper: AllProviders,
      });

      await act(async () => {
        await result.current.submitShippingInfo();
      });

      await waitFor(() => {
        expect(result.current.fieldErrors.firstName).toBe(
          'First name is required'
        );
      });
      expect(result.current.fieldErrors.email).toBe(
        'Please enter a valid email address'
      );
      expect(result.current.currentStep).toBe(CHECKOUT_STEPS.SHIPPING);
    });
  });

  describe('Payment Information', () => {
    it('updates payment info fields', () => {
      const { result } = renderHook(() => useCheckout(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.updatePaymentInfo('cardNumber', '4111 1111 1111 1111');
        result.current.updatePaymentInfo('cardHolder', 'JOHN DOE');
        result.current.updatePaymentInfo('expiryDate', '12/25');
        result.current.updatePaymentInfo('cvv', '123');
      });

      expect(result.current.paymentInfo.cardNumber).toBe('4111 1111 1111 1111');
      expect(result.current.paymentInfo.cardHolder).toBe('JOHN DOE');
      expect(result.current.paymentInfo.expiryDate).toBe('12/25');
      expect(result.current.paymentInfo.cvv).toBe('123');
    });

    it('submits valid payment info and moves to review step', async () => {
      validatePaymentDetails.mockResolvedValue({
        success: true,
        cardType: 'visa',
        lastFour: '1111',
      });

      const { result } = renderHook(() => useCheckout(), {
        wrapper: AllProviders,
      });

      // First complete shipping
      validateAddress.mockResolvedValue({
        success: true,
        normalizedAddress: { firstName: 'John' },
      });

      await act(async () => {
        await result.current.submitShippingInfo();
      });

      // Now fill payment
      act(() => {
        result.current.updatePaymentInfo('cardNumber', '4111 1111 1111 1111');
        result.current.updatePaymentInfo('cardHolder', 'JOHN DOE');
        result.current.updatePaymentInfo('expiryDate', '12/25');
        result.current.updatePaymentInfo('cvv', '123');
      });

      await act(async () => {
        await result.current.submitPaymentInfo();
      });

      await waitFor(() => {
        expect(result.current.currentStep).toBe(CHECKOUT_STEPS.REVIEW);
      });
      expect(result.current.completedSteps).toContain(CHECKOUT_STEPS.PAYMENT);
    });

    it('shows validation errors for invalid payment info', async () => {
      validatePaymentDetails.mockResolvedValue({
        success: false,
        errors: {
          cardNumber: 'Invalid card number',
          cvv: 'CVV must be 3 digits',
        },
      });

      const { result } = renderHook(() => useCheckout(), {
        wrapper: AllProviders,
      });

      // Go to payment step first
      act(() => {
        result.current.goToStep(CHECKOUT_STEPS.PAYMENT);
      });

      await act(async () => {
        await result.current.submitPaymentInfo();
      });

      await waitFor(() => {
        expect(result.current.fieldErrors.cardNumber).toBe(
          'Invalid card number'
        );
      });
      expect(result.current.fieldErrors.cvv).toBe('CVV must be 3 digits');
    });
  });

  describe('Promo Codes', () => {
    it('applies valid promo code', async () => {
      validatePromoCode.mockResolvedValue({
        success: true,
        code: 'SAVE20',
        discount: 20,
        description: '20% off',
      });

      const { result } = renderHook(() => useCheckout(), {
        wrapper: AllProviders,
      });

      await act(async () => {
        await result.current.applyPromoCode('SAVE20');
      });

      await waitFor(() => {
        expect(result.current.promoCode).toBe('SAVE20');
      });
      expect(result.current.discount).toBe(20);
    });

    it('shows error for invalid promo code', async () => {
      validatePromoCode.mockResolvedValue({
        success: false,
        message: 'Invalid promo code',
      });

      const { result } = renderHook(() => useCheckout(), {
        wrapper: AllProviders,
      });

      await act(async () => {
        await result.current.applyPromoCode('INVALID');
      });

      await waitFor(() => {
        expect(result.current.errors.promo).toBe('Invalid promo code');
      });
      expect(result.current.promoCode).toBeNull();
    });

    it('removes promo code', async () => {
      validatePromoCode.mockResolvedValue({
        success: true,
        code: 'SAVE20',
        discount: 20,
      });

      const { result } = renderHook(() => useCheckout(), {
        wrapper: AllProviders,
      });

      await act(async () => {
        await result.current.applyPromoCode('SAVE20');
      });

      act(() => {
        result.current.removePromoCode();
      });

      expect(result.current.promoCode).toBeNull();
      expect(result.current.discount).toBe(0);
    });
  });

  describe('Step Navigation', () => {
    it('can navigate back to previous step', async () => {
      validateAddress.mockResolvedValue({
        success: true,
        normalizedAddress: {},
      });

      const { result } = renderHook(() => useCheckout(), {
        wrapper: AllProviders,
      });

      // Complete shipping step
      await act(async () => {
        await result.current.submitShippingInfo();
      });

      expect(result.current.currentStep).toBe(CHECKOUT_STEPS.PAYMENT);

      act(() => {
        result.current.goToPreviousStep();
      });

      expect(result.current.currentStep).toBe(CHECKOUT_STEPS.SHIPPING);
    });

    it('can navigate to completed steps', async () => {
      validateAddress.mockResolvedValue({
        success: true,
        normalizedAddress: {},
      });
      validatePaymentDetails.mockResolvedValue({
        success: true,
      });

      const { result } = renderHook(() => useCheckout(), {
        wrapper: AllProviders,
      });

      // Complete shipping and payment
      await act(async () => {
        await result.current.submitShippingInfo();
      });

      await act(async () => {
        await result.current.submitPaymentInfo();
      });

      expect(result.current.currentStep).toBe(CHECKOUT_STEPS.REVIEW);

      // Navigate back to shipping
      act(() => {
        result.current.goToStep(CHECKOUT_STEPS.SHIPPING);
      });

      expect(result.current.currentStep).toBe(CHECKOUT_STEPS.SHIPPING);
    });

    it('provides correct step index', () => {
      const { result } = renderHook(() => useCheckout(), {
        wrapper: AllProviders,
      });

      expect(result.current.currentStepIndex).toBe(0);

      act(() => {
        result.current.goToStep(CHECKOUT_STEPS.PAYMENT);
      });

      // Can't go to uncompleted step
      expect(result.current.currentStepIndex).toBe(0);
    });
  });

  describe('Order Placement', () => {
    it('successfully places order', async () => {
      processPayment.mockResolvedValue({
        success: true,
        transactionId: 'TXN-123',
        amount: 100,
        cardType: 'visa',
        lastFour: '1111',
      });

      createOrder.mockResolvedValue({
        success: true,
        order: {
          orderId: '3DM-ABC123',
          status: 'confirmed',
          items: [],
          totals: { subtotal: 100, tax: 10, shipping: 0, total: 110 },
        },
      });

      const { result } = renderHook(() => useCheckout(), {
        wrapper: AllProviders,
      });

      await act(async () => {
        const success = await result.current.placeOrder();
        expect(success).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.orderResult).toBeDefined();
      });
      expect(result.current.orderResult.orderId).toBe('3DM-ABC123');
      expect(result.current.currentStep).toBe(CHECKOUT_STEPS.CONFIRMATION);
    });

    it('handles payment failure', async () => {
      processPayment.mockResolvedValue({
        success: false,
        message: 'Transaction declined: Insufficient funds',
      });

      const { result } = renderHook(() => useCheckout(), {
        wrapper: AllProviders,
      });

      await act(async () => {
        const success = await result.current.placeOrder();
        expect(success).toBe(false);
      });

      await waitFor(() => {
        expect(result.current.errors.payment).toBe(
          'Transaction declined: Insufficient funds'
        );
      });
      expect(result.current.orderResult).toBeNull();
    });
  });

  describe('Checkout Reset', () => {
    it('resets checkout state', async () => {
      validateAddress.mockResolvedValue({
        success: true,
        normalizedAddress: { firstName: 'John' },
      });

      const { result } = renderHook(() => useCheckout(), {
        wrapper: AllProviders,
      });

      // Make some changes
      act(() => {
        result.current.updateShippingInfo('firstName', 'John');
      });

      await act(async () => {
        await result.current.submitShippingInfo();
      });

      // Reset
      act(() => {
        result.current.resetCheckout();
      });

      expect(result.current.currentStep).toBe(CHECKOUT_STEPS.SHIPPING);
      expect(result.current.completedSteps).toEqual([]);
      expect(result.current.shippingInfo.firstName).toBe('');
    });
  });

  describe('Totals Calculation', () => {
    it('calculates totals correctly', () => {
      const { result } = renderHook(() => useCheckout(), {
        wrapper: AllProviders,
      });

      expect(result.current.totals).toBeDefined();
      expect(result.current.totals.subtotal).toBe(0);
      expect(result.current.totals.tax).toBe(0);
      expect(result.current.totals.shipping).toBe(0);
      expect(result.current.totals.total).toBe(0);
    });

    it('includes shipping cost for priority option', () => {
      const { result } = renderHook(() => useCheckout(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.setShippingOption('priority');
      });

      expect(result.current.shippingOption).toBe('priority');
      expect(result.current.totals.shipping).toBe(4.99);
    });
  });
});
