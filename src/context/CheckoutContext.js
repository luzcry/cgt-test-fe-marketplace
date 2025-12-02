/**
 * CheckoutContext - Multi-step Checkout State Management
 *
 * Manages the complete checkout flow state including:
 * - Current step tracking
 * - Shipping information
 * - Payment details
 * - Order confirmation
 * - Loading and error states
 */

import { createContext, useContext, useCallback, useMemo, useReducer } from 'react';
import {
  validateAddress,
  validatePaymentDetails,
  processPayment,
  createOrder,
  validatePromoCode,
  trackCheckoutStep
} from '../services/checkoutService';
import { useCart } from './CartContext';

// Checkout steps configuration
export const CHECKOUT_STEPS = {
  SHIPPING: 'shipping',
  PAYMENT: 'payment',
  REVIEW: 'review',
  CONFIRMATION: 'confirmation'
};

export const STEP_ORDER = [
  CHECKOUT_STEPS.SHIPPING,
  CHECKOUT_STEPS.PAYMENT,
  CHECKOUT_STEPS.REVIEW,
  CHECKOUT_STEPS.CONFIRMATION
];

export const STEP_TITLES = {
  [CHECKOUT_STEPS.SHIPPING]: 'Shipping',
  [CHECKOUT_STEPS.PAYMENT]: 'Payment',
  [CHECKOUT_STEPS.REVIEW]: 'Review',
  [CHECKOUT_STEPS.CONFIRMATION]: 'Confirmation'
};

// Initial state
const initialState = {
  currentStep: CHECKOUT_STEPS.SHIPPING,
  completedSteps: [],
  shippingInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  },
  paymentInfo: {
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  },
  shippingOption: 'instant',
  promoCode: null,
  discount: 0,
  orderResult: null,
  paymentResult: null,
  isLoading: false,
  errors: {},
  fieldErrors: {}
};

// Action types
const ACTIONS = {
  SET_STEP: 'SET_STEP',
  COMPLETE_STEP: 'COMPLETE_STEP',
  UPDATE_SHIPPING: 'UPDATE_SHIPPING',
  UPDATE_PAYMENT: 'UPDATE_PAYMENT',
  SET_SHIPPING_OPTION: 'SET_SHIPPING_OPTION',
  SET_PROMO: 'SET_PROMO',
  CLEAR_PROMO: 'CLEAR_PROMO',
  SET_PAYMENT_RESULT: 'SET_PAYMENT_RESULT',
  SET_ORDER_RESULT: 'SET_ORDER_RESULT',
  SET_LOADING: 'SET_LOADING',
  SET_ERRORS: 'SET_ERRORS',
  SET_FIELD_ERRORS: 'SET_FIELD_ERRORS',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  CLEAR_FIELD_ERROR: 'CLEAR_FIELD_ERROR',
  RESET: 'RESET'
};

// Reducer
function checkoutReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_STEP:
      return { ...state, currentStep: action.payload };

    case ACTIONS.COMPLETE_STEP:
      if (!state.completedSteps.includes(action.payload)) {
        return {
          ...state,
          completedSteps: [...state.completedSteps, action.payload]
        };
      }
      return state;

    case ACTIONS.UPDATE_SHIPPING:
      return {
        ...state,
        shippingInfo: { ...state.shippingInfo, ...action.payload }
      };

    case ACTIONS.UPDATE_PAYMENT:
      return {
        ...state,
        paymentInfo: { ...state.paymentInfo, ...action.payload }
      };

    case ACTIONS.SET_SHIPPING_OPTION:
      return { ...state, shippingOption: action.payload };

    case ACTIONS.SET_PROMO:
      return {
        ...state,
        promoCode: action.payload.code,
        discount: action.payload.discount
      };

    case ACTIONS.CLEAR_PROMO:
      return { ...state, promoCode: null, discount: 0 };

    case ACTIONS.SET_PAYMENT_RESULT:
      return { ...state, paymentResult: action.payload };

    case ACTIONS.SET_ORDER_RESULT:
      return { ...state, orderResult: action.payload };

    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTIONS.SET_ERRORS:
      return { ...state, errors: action.payload };

    case ACTIONS.SET_FIELD_ERRORS:
      return { ...state, fieldErrors: action.payload };

    case ACTIONS.CLEAR_ERRORS:
      return { ...state, errors: {}, fieldErrors: {} };

    case ACTIONS.CLEAR_FIELD_ERROR:
      const { [action.payload]: removed, ...remainingErrors } = state.fieldErrors;
      return { ...state, fieldErrors: remainingErrors };

    case ACTIONS.RESET:
      return initialState;

    default:
      return state;
  }
}

// Create context
const CheckoutContext = createContext(null);

// Provider component
export function CheckoutProvider({ children }) {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);
  const { cartItems, cartTotal, clearCart } = useCart();

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = cartTotal;
    const discount = state.discount;
    const discountedSubtotal = Math.max(0, subtotal - discount);
    const tax = discountedSubtotal * 0.1; // 10% tax
    const shipping = state.shippingOption === 'priority' ? 4.99 : 0;
    const total = discountedSubtotal + tax + shipping;

    return {
      subtotal,
      discount,
      discountedSubtotal,
      tax,
      shipping,
      total
    };
  }, [cartTotal, state.discount, state.shippingOption]);

  // Navigation helpers
  const getCurrentStepIndex = useCallback(() => {
    return STEP_ORDER.indexOf(state.currentStep);
  }, [state.currentStep]);

  const canGoToStep = useCallback((step) => {
    const targetIndex = STEP_ORDER.indexOf(step);
    const currentIndex = getCurrentStepIndex();

    // Can always go back
    if (targetIndex < currentIndex) return true;

    // Can go forward only if all previous steps are completed
    const requiredSteps = STEP_ORDER.slice(0, targetIndex);
    return requiredSteps.every(s => state.completedSteps.includes(s));
  }, [state.completedSteps, getCurrentStepIndex]);

  const goToStep = useCallback((step) => {
    if (canGoToStep(step)) {
      dispatch({ type: ACTIONS.SET_STEP, payload: step });
      dispatch({ type: ACTIONS.CLEAR_ERRORS });
      trackCheckoutStep(step, { cartItems: cartItems.length });
    }
  }, [canGoToStep, cartItems.length]);

  const goToNextStep = useCallback(() => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < STEP_ORDER.length - 1) {
      const nextStep = STEP_ORDER[currentIndex + 1];
      goToStep(nextStep);
    }
  }, [getCurrentStepIndex, goToStep]);

  const goToPreviousStep = useCallback(() => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      const prevStep = STEP_ORDER[currentIndex - 1];
      goToStep(prevStep);
    }
  }, [getCurrentStepIndex, goToStep]);

  // Shipping handlers
  const updateShippingInfo = useCallback((field, value) => {
    dispatch({ type: ACTIONS.UPDATE_SHIPPING, payload: { [field]: value } });
    dispatch({ type: ACTIONS.CLEAR_FIELD_ERROR, payload: field });
  }, []);

  const submitShippingInfo = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.CLEAR_ERRORS });

    try {
      const result = await validateAddress(state.shippingInfo);

      if (!result.success) {
        dispatch({ type: ACTIONS.SET_FIELD_ERRORS, payload: result.errors });
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return false;
      }

      dispatch({ type: ACTIONS.UPDATE_SHIPPING, payload: result.normalizedAddress });
      dispatch({ type: ACTIONS.COMPLETE_STEP, payload: CHECKOUT_STEPS.SHIPPING });
      dispatch({ type: ACTIONS.SET_STEP, payload: CHECKOUT_STEPS.PAYMENT });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      trackCheckoutStep(CHECKOUT_STEPS.PAYMENT, { cartItems: cartItems.length });
      return true;
    } catch (error) {
      dispatch({
        type: ACTIONS.SET_ERRORS,
        payload: { general: 'Failed to validate address. Please try again.' }
      });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return false;
    }
  }, [state.shippingInfo, cartItems.length]);

  // Payment handlers
  const updatePaymentInfo = useCallback((field, value) => {
    dispatch({ type: ACTIONS.UPDATE_PAYMENT, payload: { [field]: value } });
    dispatch({ type: ACTIONS.CLEAR_FIELD_ERROR, payload: field });
  }, []);

  const submitPaymentInfo = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.CLEAR_ERRORS });

    try {
      const result = await validatePaymentDetails(state.paymentInfo);

      if (!result.success) {
        dispatch({ type: ACTIONS.SET_FIELD_ERRORS, payload: result.errors });
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return false;
      }

      dispatch({ type: ACTIONS.COMPLETE_STEP, payload: CHECKOUT_STEPS.PAYMENT });
      dispatch({ type: ACTIONS.SET_STEP, payload: CHECKOUT_STEPS.REVIEW });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      trackCheckoutStep(CHECKOUT_STEPS.REVIEW, { cartItems: cartItems.length });
      return true;
    } catch (error) {
      dispatch({
        type: ACTIONS.SET_ERRORS,
        payload: { general: 'Failed to validate payment. Please try again.' }
      });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return false;
    }
  }, [state.paymentInfo, cartItems.length]);

  // Promo code handler
  const applyPromoCode = useCallback(async (code) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.CLEAR_ERRORS });

    try {
      const result = await validatePromoCode(code, totals.subtotal);

      if (!result.success) {
        dispatch({
          type: ACTIONS.SET_ERRORS,
          payload: { promo: result.message }
        });
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return false;
      }

      dispatch({
        type: ACTIONS.SET_PROMO,
        payload: { code: result.code, discount: result.discount }
      });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return true;
    } catch (error) {
      dispatch({
        type: ACTIONS.SET_ERRORS,
        payload: { promo: 'Failed to apply promo code.' }
      });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return false;
    }
  }, [totals.subtotal]);

  const removePromoCode = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_PROMO });
  }, []);

  // Shipping option handler
  const setShippingOption = useCallback((option) => {
    dispatch({ type: ACTIONS.SET_SHIPPING_OPTION, payload: option });
  }, []);

  // Place order
  const placeOrder = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.CLEAR_ERRORS });

    try {
      // Process payment
      const paymentResult = await processPayment(state.paymentInfo, totals.total);

      if (!paymentResult.success) {
        dispatch({
          type: ACTIONS.SET_ERRORS,
          payload: { payment: paymentResult.message }
        });
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return false;
      }

      dispatch({ type: ACTIONS.SET_PAYMENT_RESULT, payload: paymentResult });

      // Create order
      const orderResult = await createOrder({
        items: cartItems,
        shippingAddress: state.shippingInfo,
        paymentResult,
        totals
      });

      if (!orderResult.success) {
        dispatch({
          type: ACTIONS.SET_ERRORS,
          payload: { order: 'Failed to create order. Please try again.' }
        });
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return false;
      }

      dispatch({ type: ACTIONS.SET_ORDER_RESULT, payload: orderResult.order });
      dispatch({ type: ACTIONS.COMPLETE_STEP, payload: CHECKOUT_STEPS.REVIEW });
      dispatch({ type: ACTIONS.SET_STEP, payload: CHECKOUT_STEPS.CONFIRMATION });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });

      // Clear cart after successful order
      clearCart();

      trackCheckoutStep(CHECKOUT_STEPS.CONFIRMATION, { orderId: orderResult.order.orderId });
      return true;
    } catch (error) {
      dispatch({
        type: ACTIONS.SET_ERRORS,
        payload: { general: 'An unexpected error occurred. Please try again.' }
      });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return false;
    }
  }, [state.paymentInfo, state.shippingInfo, cartItems, totals, clearCart]);

  // Reset checkout
  const resetCheckout = useCallback(() => {
    dispatch({ type: ACTIONS.RESET });
  }, []);

  // Context value
  const value = useMemo(() => ({
    // State
    ...state,
    cartItems,
    totals,

    // Step navigation
    currentStepIndex: getCurrentStepIndex(),
    totalSteps: STEP_ORDER.length,
    canGoToStep,
    goToStep,
    goToNextStep,
    goToPreviousStep,

    // Shipping
    updateShippingInfo,
    submitShippingInfo,

    // Payment
    updatePaymentInfo,
    submitPaymentInfo,

    // Promo
    applyPromoCode,
    removePromoCode,

    // Shipping option
    setShippingOption,

    // Order
    placeOrder,
    resetCheckout
  }), [
    state,
    cartItems,
    totals,
    getCurrentStepIndex,
    canGoToStep,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    updateShippingInfo,
    submitShippingInfo,
    updatePaymentInfo,
    submitPaymentInfo,
    applyPromoCode,
    removePromoCode,
    setShippingOption,
    placeOrder,
    resetCheckout
  ]);

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

// Custom hook
export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
