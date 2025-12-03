/**
 * Checkout Service - Mock API for simulating checkout flow
 *
 * Provides realistic async operations with simulated network delays
 * and validation logic for a complete checkout experience.
 */

// Simulated network delay range (ms)
const DELAY_MIN = 800;
const DELAY_MAX = 1500;

/**
 * Generates a random delay to simulate network latency
 */
const simulateNetworkDelay = () =>
  new Promise((resolve) =>
    setTimeout(resolve, Math.random() * (DELAY_MAX - DELAY_MIN) + DELAY_MIN)
  );

/**
 * Generates a unique order ID with timestamp
 */
const generateOrderId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `3DM-${timestamp}-${random}`;
};

/**
 * Generates a unique transaction ID
 */
const generateTransactionId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TXN-';
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) result += '-';
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// =============================================================================
// Address Validation Service
// =============================================================================

/**
 * Validates and normalizes a shipping address
 * Simulates real address validation API behavior
 *
 * @param {Object} address - The address to validate
 * @returns {Promise<Object>} - Validation result with normalized address
 */
export const validateAddress = async (address) => {
  await simulateNetworkDelay();

  const {
    firstName,
    lastName,
    email,
    phone,
    street,
    city,
    state,
    zipCode,
    country,
  } = address;
  const errors = {};

  // Validate required fields
  if (!firstName?.trim()) errors.firstName = 'First name is required';
  if (!lastName?.trim()) errors.lastName = 'Last name is required';
  if (!email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address';
  }
  if (!phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^[\d\s\-+()]{10,}$/.test(phone.replace(/\s/g, ''))) {
    errors.phone = 'Please enter a valid phone number';
  }
  if (!street?.trim()) errors.street = 'Street address is required';
  if (!city?.trim()) errors.city = 'City is required';
  if (!state?.trim()) errors.state = 'State is required';
  if (!zipCode?.trim()) {
    errors.zipCode = 'ZIP code is required';
  } else if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
    errors.zipCode =
      'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
  }
  if (!country?.trim()) errors.country = 'Country is required';

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      message: 'Please correct the errors in your address',
    };
  }

  // Return normalized address
  return {
    success: true,
    normalizedAddress: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim().toUpperCase(),
      zipCode: zipCode.trim(),
      country: country.trim(),
      formatted: `${street.trim()}, ${city.trim()}, ${state.trim().toUpperCase()} ${zipCode.trim()}`,
    },
    message: 'Address validated successfully',
  };
};

// =============================================================================
// Payment Processing Service
// =============================================================================

/**
 * Card type detection based on card number prefix
 */
export const detectCardType = (cardNumber) => {
  const number = cardNumber.replace(/\s/g, '');

  if (/^4/.test(number)) return 'visa';
  if (/^5[1-5]/.test(number)) return 'mastercard';
  if (/^3[47]/.test(number)) return 'amex';
  if (/^6(?:011|5)/.test(number)) return 'discover';

  return 'unknown';
};

/**
 * Validates payment card details
 * Implements Luhn algorithm for card number validation
 *
 * @param {Object} paymentDetails - Card details to validate
 * @returns {Promise<Object>} - Validation result
 */
export const validatePaymentDetails = async (paymentDetails) => {
  await simulateNetworkDelay();

  const { cardNumber, cardHolder, expiryDate, cvv } = paymentDetails;
  const errors = {};

  // Validate card number (Luhn algorithm)
  const cleanNumber = cardNumber?.replace(/\s/g, '') || '';
  if (!cleanNumber) {
    errors.cardNumber = 'Card number is required';
  } else if (!/^\d{13,19}$/.test(cleanNumber)) {
    errors.cardNumber = 'Please enter a valid card number';
  } else {
    // Luhn algorithm check
    let sum = 0;
    let isEven = false;
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i), 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    if (sum % 10 !== 0) {
      errors.cardNumber = 'Invalid card number';
    }
  }

  // Validate cardholder name
  if (!cardHolder?.trim()) {
    errors.cardHolder = 'Cardholder name is required';
  } else if (cardHolder.trim().length < 2) {
    errors.cardHolder = 'Please enter the full name as shown on card';
  }

  // Validate expiry date
  if (!expiryDate?.trim()) {
    errors.expiryDate = 'Expiry date is required';
  } else {
    const [month, year] = expiryDate.split('/').map((s) => s?.trim());
    const expMonth = parseInt(month, 10);
    const expYear = parseInt(`20${year}`, 10);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (!month || !year || !/^\d{2}$/.test(month) || !/^\d{2}$/.test(year)) {
      errors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    } else if (expMonth < 1 || expMonth > 12) {
      errors.expiryDate = 'Invalid month';
    } else if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    ) {
      errors.expiryDate = 'Card has expired';
    }
  }

  // Validate CVV
  const cardType = detectCardType(cleanNumber);
  const cvvLength = cardType === 'amex' ? 4 : 3;
  if (!cvv?.trim()) {
    errors.cvv = 'CVV is required';
  } else if (!/^\d+$/.test(cvv) || cvv.length !== cvvLength) {
    errors.cvv = `CVV must be ${cvvLength} digits`;
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      message: 'Please correct the errors in your payment details',
    };
  }

  return {
    success: true,
    cardType,
    lastFour: cleanNumber.slice(-4),
    message: 'Payment details validated',
  };
};

/**
 * Processes payment transaction
 * Simulates real payment gateway behavior with random success/failure scenarios
 *
 * @param {Object} paymentInfo - Payment information
 * @param {number} amount - Amount to charge
 * @returns {Promise<Object>} - Transaction result
 */
export const processPayment = async (paymentInfo, amount) => {
  await simulateNetworkDelay();

  const { cardNumber, cardHolder } = paymentInfo;
  const cleanNumber = cardNumber?.replace(/\s/g, '') || '';

  // Simulate specific test scenarios based on card number endings
  const lastDigit = cleanNumber.slice(-1);

  // Card ending in 0 = insufficient funds
  if (lastDigit === '0') {
    return {
      success: false,
      error: 'insufficient_funds',
      message: 'Transaction declined: Insufficient funds',
      code: 'PAYMENT_DECLINED',
    };
  }

  // Card ending in 9 = card declined
  if (lastDigit === '9') {
    return {
      success: false,
      error: 'card_declined',
      message: 'Transaction declined: Please contact your bank',
      code: 'CARD_DECLINED',
    };
  }

  // Successful transaction
  return {
    success: true,
    transactionId: generateTransactionId(),
    amount: amount,
    currency: 'USD',
    cardType: detectCardType(cleanNumber),
    lastFour: cleanNumber.slice(-4),
    cardHolder: cardHolder,
    timestamp: new Date().toISOString(),
    message: 'Payment processed successfully',
  };
};

// =============================================================================
// Order Service
// =============================================================================

/**
 * Creates a new order
 *
 * @param {Object} orderData - Complete order information
 * @returns {Promise<Object>} - Created order details
 */
export const createOrder = async (orderData) => {
  await simulateNetworkDelay();

  const { items, shippingAddress, paymentResult, totals } = orderData;

  const orderId = generateOrderId();
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(
    estimatedDelivery.getDate() + Math.floor(Math.random() * 3) + 3
  ); // 3-5 days

  return {
    success: true,
    order: {
      orderId,
      status: 'confirmed',
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
        subtotal: item.price * item.quantity,
      })),
      itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
      shippingAddress: {
        ...shippingAddress,
        formatted: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}`,
      },
      payment: {
        transactionId: paymentResult.transactionId,
        cardType: paymentResult.cardType,
        lastFour: paymentResult.lastFour,
        amount: paymentResult.amount,
      },
      totals: {
        subtotal: totals.subtotal,
        tax: totals.tax,
        shipping: totals.shipping,
        total: totals.total,
      },
      estimatedDelivery: estimatedDelivery.toISOString(),
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Order Placed',
          description: 'Your order has been received',
          timestamp: new Date().toISOString(),
          completed: true,
        },
        {
          status: 'Processing',
          description: 'Preparing your digital assets',
          timestamp: null,
          completed: false,
        },
        {
          status: 'Ready for Download',
          description: 'Your files are ready',
          timestamp: null,
          completed: false,
        },
        {
          status: 'Delivered',
          description: 'Download links sent to email',
          timestamp: estimatedDelivery.toISOString(),
          completed: false,
        },
      ],
    },
    message: 'Order created successfully',
  };
};

/**
 * Calculate shipping options based on address
 *
 * @param {Object} address - Shipping address
 * @returns {Promise<Object>} - Available shipping options
 */
export const getShippingOptions = async (address) => {
  await simulateNetworkDelay();

  // For digital products, shipping is instant/free
  // But we provide options for the experience
  return {
    success: true,
    options: [
      {
        id: 'instant',
        name: 'Instant Download',
        description: 'Get immediate access to your files',
        price: 0,
        estimatedDays: 0,
        recommended: true,
      },
      {
        id: 'priority',
        name: 'Priority Processing',
        description: 'Priority queue for download links',
        price: 4.99,
        estimatedDays: 0,
        recommended: false,
      },
    ],
  };
};

// =============================================================================
// Promo/Discount Service
// =============================================================================

/**
 * Validates and applies a promo code
 *
 * @param {string} code - Promo code to validate
 * @param {number} subtotal - Current cart subtotal
 * @returns {Promise<Object>} - Promo validation result
 */
export const validatePromoCode = async (code, subtotal) => {
  await simulateNetworkDelay();

  const normalizedCode = code.trim().toUpperCase();

  // Mock promo codes
  const promoCodes = {
    WELCOME10: {
      type: 'percentage',
      value: 10,
      minOrder: 0,
      description: '10% off your order',
    },
    SAVE20: {
      type: 'percentage',
      value: 20,
      minOrder: 100,
      description: '20% off orders over $100',
    },
    '3DFREE': {
      type: 'fixed',
      value: 25,
      minOrder: 50,
      description: '$25 off orders over $50',
    },
    NEWUSER: {
      type: 'percentage',
      value: 15,
      minOrder: 0,
      description: '15% new user discount',
    },
  };

  const promo = promoCodes[normalizedCode];

  if (!promo) {
    return {
      success: false,
      error: 'invalid_code',
      message: 'Invalid promo code',
    };
  }

  if (subtotal < promo.minOrder) {
    return {
      success: false,
      error: 'minimum_not_met',
      message: `Minimum order of $${promo.minOrder} required for this code`,
    };
  }

  const discount =
    promo.type === 'percentage' ? (subtotal * promo.value) / 100 : promo.value;

  return {
    success: true,
    code: normalizedCode,
    type: promo.type,
    value: promo.value,
    discount: Math.min(discount, subtotal), // Can't discount more than subtotal
    description: promo.description,
    message: `Promo code applied: ${promo.description}`,
  };
};

// =============================================================================
// Analytics Service (for tracking checkout events)
// =============================================================================

/**
 * Tracks checkout step completion
 *
 * @param {string} step - Current checkout step
 * @param {Object} data - Additional tracking data
 */
export const trackCheckoutStep = async (step, data = {}) => {
  // In a real app, this would send to analytics
  console.log(`[Analytics] Checkout Step: ${step}`, {
    timestamp: new Date().toISOString(),
    ...data,
  });
  return { tracked: true };
};

const checkoutService = {
  validateAddress,
  validatePaymentDetails,
  processPayment,
  detectCardType,
  createOrder,
  getShippingOptions,
  validatePromoCode,
  trackCheckoutStep,
};

export default checkoutService;
