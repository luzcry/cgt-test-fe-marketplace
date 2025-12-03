import {
  validateAddress,
  validatePaymentDetails,
  processPayment,
  createOrder,
  validatePromoCode,
  detectCardType,
  getShippingOptions,
} from '../services/checkoutService';

describe('Checkout Service', () => {
  describe('validateAddress', () => {
    it('validates a complete valid address', async () => {
      const address = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '555-123-4567',
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
      };

      const result = await validateAddress(address);

      expect(result.success).toBe(true);
      expect(result.normalizedAddress).toBeDefined();
      expect(result.normalizedAddress.email).toBe('john@example.com');
    });

    it('returns errors for missing required fields', async () => {
      const address = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      };

      const result = await validateAddress(address);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors.firstName).toBe('First name is required');
      expect(result.errors.email).toBe('Email is required');
    });

    it('validates email format', async () => {
      const address = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        phone: '555-123-4567',
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
      };

      const result = await validateAddress(address);

      expect(result.success).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address');
    });

    it('validates ZIP code format', async () => {
      const address = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '555-123-4567',
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: 'invalid',
        country: 'United States',
      };

      const result = await validateAddress(address);

      expect(result.success).toBe(false);
      expect(result.errors.zipCode).toContain('valid ZIP code');
    });

    it('normalizes email to lowercase', async () => {
      const address = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'JOHN@EXAMPLE.COM',
        phone: '555-123-4567',
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
      };

      const result = await validateAddress(address);

      expect(result.success).toBe(true);
      expect(result.normalizedAddress.email).toBe('john@example.com');
    });
  });

  describe('detectCardType', () => {
    it('detects Visa cards', () => {
      expect(detectCardType('4111111111111111')).toBe('visa');
      expect(detectCardType('4242424242424242')).toBe('visa');
    });

    it('detects Mastercard cards', () => {
      expect(detectCardType('5111111111111111')).toBe('mastercard');
      expect(detectCardType('5500000000000004')).toBe('mastercard');
    });

    it('detects American Express cards', () => {
      expect(detectCardType('371111111111111')).toBe('amex');
      expect(detectCardType('341111111111111')).toBe('amex');
    });

    it('detects Discover cards', () => {
      expect(detectCardType('6011111111111111')).toBe('discover');
      expect(detectCardType('6500000000000002')).toBe('discover');
    });

    it('returns unknown for unrecognized cards', () => {
      expect(detectCardType('1234567890123456')).toBe('unknown');
    });

    it('handles card numbers with spaces', () => {
      expect(detectCardType('4111 1111 1111 1111')).toBe('visa');
    });
  });

  describe('validatePaymentDetails', () => {
    it('validates valid payment details', async () => {
      const payment = {
        cardNumber: '4111111111111111',
        cardHolder: 'JOHN DOE',
        expiryDate: '12/28',
        cvv: '123',
      };

      const result = await validatePaymentDetails(payment);

      expect(result.success).toBe(true);
      expect(result.cardType).toBe('visa');
      expect(result.lastFour).toBe('1111');
    });

    it('returns errors for missing fields', async () => {
      const payment = {
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
      };

      const result = await validatePaymentDetails(payment);

      expect(result.success).toBe(false);
      expect(result.errors.cardNumber).toBe('Card number is required');
      expect(result.errors.cardHolder).toBe('Cardholder name is required');
    });

    it('validates card number with Luhn algorithm', async () => {
      const payment = {
        cardNumber: '1234567890123456', // Invalid Luhn
        cardHolder: 'JOHN DOE',
        expiryDate: '12/28',
        cvv: '123',
      };

      const result = await validatePaymentDetails(payment);

      expect(result.success).toBe(false);
      expect(result.errors.cardNumber).toBe('Invalid card number');
    });

    it('validates expiry date format', async () => {
      const payment = {
        cardNumber: '4111111111111111',
        cardHolder: 'JOHN DOE',
        expiryDate: 'invalid',
        cvv: '123',
      };

      const result = await validatePaymentDetails(payment);

      expect(result.success).toBe(false);
      expect(result.errors.expiryDate).toContain('valid expiry date');
    });

    it('rejects expired cards', async () => {
      const payment = {
        cardNumber: '4111111111111111',
        cardHolder: 'JOHN DOE',
        expiryDate: '01/20', // Past date
        cvv: '123',
      };

      const result = await validatePaymentDetails(payment);

      expect(result.success).toBe(false);
      expect(result.errors.expiryDate).toBe('Card has expired');
    });

    it('validates CVV length for Amex', async () => {
      const payment = {
        cardNumber: '371111111111111', // Amex
        cardHolder: 'JOHN DOE',
        expiryDate: '12/28',
        cvv: '123', // Should be 4 digits for Amex
      };

      const result = await validatePaymentDetails(payment);

      expect(result.success).toBe(false);
      expect(result.errors.cvv).toContain('4 digits');
    });
  });

  describe('processPayment', () => {
    it('processes payment successfully', async () => {
      const payment = {
        cardNumber: '4111111111111111',
        cardHolder: 'JOHN DOE',
      };

      const result = await processPayment(payment, 100);

      expect(result.success).toBe(true);
      expect(result.transactionId).toBeDefined();
      expect(result.amount).toBe(100);
    });

    it('declines cards ending in 0 (insufficient funds)', async () => {
      const payment = {
        cardNumber: '4111111111111110',
        cardHolder: 'JOHN DOE',
      };

      const result = await processPayment(payment, 100);

      expect(result.success).toBe(false);
      expect(result.error).toBe('insufficient_funds');
    });

    it('declines cards ending in 9', async () => {
      const payment = {
        cardNumber: '4111111111111119',
        cardHolder: 'JOHN DOE',
      };

      const result = await processPayment(payment, 100);

      expect(result.success).toBe(false);
      expect(result.error).toBe('card_declined');
    });
  });

  describe('createOrder', () => {
    it('creates order successfully', async () => {
      const orderData = {
        items: [
          {
            id: '1',
            name: 'Test Product',
            price: 50,
            quantity: 2,
            category: 'Props',
          },
        ],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
        },
        paymentResult: {
          transactionId: 'TXN-123',
          cardType: 'visa',
          lastFour: '1111',
          amount: 110,
        },
        totals: {
          subtotal: 100,
          tax: 10,
          shipping: 0,
          total: 110,
        },
      };

      const result = await createOrder(orderData);

      expect(result.success).toBe(true);
      expect(result.order).toBeDefined();
      expect(result.order.orderId).toMatch(/^3DM-/);
      expect(result.order.status).toBe('confirmed');
      expect(result.order.items).toHaveLength(1);
    });

    it('includes order timeline', async () => {
      const orderData = {
        items: [],
        shippingAddress: {},
        paymentResult: {},
        totals: {},
      };

      const result = await createOrder(orderData);

      expect(result.order.timeline).toHaveLength(4);
      expect(result.order.timeline[0].status).toBe('Order Placed');
      expect(result.order.timeline[0].completed).toBe(true);
    });
  });

  describe('validatePromoCode', () => {
    it('validates WELCOME10 promo code', async () => {
      const result = await validatePromoCode('WELCOME10', 100);

      expect(result.success).toBe(true);
      expect(result.code).toBe('WELCOME10');
      expect(result.type).toBe('percentage');
      expect(result.discount).toBe(10); // 10% of 100
    });

    it('validates SAVE20 with minimum order', async () => {
      const result = await validatePromoCode('SAVE20', 150);

      expect(result.success).toBe(true);
      expect(result.discount).toBe(30); // 20% of 150
    });

    it('rejects SAVE20 for orders under $100', async () => {
      const result = await validatePromoCode('SAVE20', 50);

      expect(result.success).toBe(false);
      expect(result.error).toBe('minimum_not_met');
    });

    it('rejects invalid promo codes', async () => {
      const result = await validatePromoCode('INVALID', 100);

      expect(result.success).toBe(false);
      expect(result.error).toBe('invalid_code');
    });

    it('handles case-insensitive codes', async () => {
      const result = await validatePromoCode('welcome10', 100);

      expect(result.success).toBe(true);
      expect(result.code).toBe('WELCOME10');
    });
  });

  describe('getShippingOptions', () => {
    it('returns shipping options', async () => {
      const result = await getShippingOptions({});

      expect(result.success).toBe(true);
      expect(result.options).toHaveLength(2);
      expect(result.options[0].id).toBe('instant');
      expect(result.options[0].price).toBe(0);
    });

    it('marks instant download as recommended', async () => {
      const result = await getShippingOptions({});

      const instantOption = result.options.find((o) => o.id === 'instant');
      expect(instantOption.recommended).toBe(true);
    });
  });
});
