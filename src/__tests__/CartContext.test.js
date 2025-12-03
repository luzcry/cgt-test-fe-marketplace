import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';

const mockProduct = {
  id: 'test-1',
  name: 'Test Product',
  price: 10,
  currency: 'USD',
};

const mockProduct2 = {
  id: 'test-2',
  name: 'Test Product 2',
  price: 20,
  currency: 'USD',
};

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  describe('useCart hook', () => {
    it('throws error when used outside CartProvider', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useCart());
      }).toThrow('useCart must be used within a CartProvider');

      consoleSpy.mockRestore();
    });

    it('provides initial empty cart state', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.cartItems).toEqual([]);
      expect(result.current.cartCount).toBe(0);
      expect(result.current.cartTotal).toBe(0);
    });
  });

  describe('addToCart', () => {
    it('adds a new product to cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0]).toEqual({
        ...mockProduct,
        quantity: 1,
      });
      expect(result.current.cartCount).toBe(1);
      expect(result.current.cartTotal).toBe(10);
    });

    it('increments quantity when adding existing product', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockProduct);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].quantity).toBe(2);
      expect(result.current.cartCount).toBe(2);
      expect(result.current.cartTotal).toBe(20);
    });

    it('handles multiple different products', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockProduct2);
      });

      expect(result.current.cartItems).toHaveLength(2);
      expect(result.current.cartCount).toBe(2);
      expect(result.current.cartTotal).toBe(30);
    });
  });

  describe('removeFromCart', () => {
    it('removes a product from cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockProduct2);
      });

      act(() => {
        result.current.removeFromCart(mockProduct.id);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].id).toBe(mockProduct2.id);
    });

    it('does nothing when removing non-existent product', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.removeFromCart('non-existent');
      });

      expect(result.current.cartItems).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('updates product quantity', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.updateQuantity(mockProduct.id, 5);
      });

      expect(result.current.cartItems[0].quantity).toBe(5);
      expect(result.current.cartCount).toBe(5);
      expect(result.current.cartTotal).toBe(50);
    });

    it('removes product when quantity set to 0', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.updateQuantity(mockProduct.id, 0);
      });

      expect(result.current.cartItems).toHaveLength(0);
    });

    it('removes product when quantity set to negative', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.updateQuantity(mockProduct.id, -1);
      });

      expect(result.current.cartItems).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('removes all items from cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockProduct2);
      });

      expect(result.current.cartItems).toHaveLength(2);

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.cartItems).toHaveLength(0);
      expect(result.current.cartCount).toBe(0);
      expect(result.current.cartTotal).toBe(0);
    });
  });

  describe('localStorage persistence', () => {
    it('saves cart to localStorage when items change', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      const stored = JSON.parse(localStorage.getItem('marketplace_cart'));
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe(mockProduct.id);
    });

    it('loads cart from localStorage on mount', () => {
      const savedCart = [{ ...mockProduct, quantity: 3 }];
      localStorage.setItem('marketplace_cart', JSON.stringify(savedCart));

      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].quantity).toBe(3);
      expect(result.current.cartCount).toBe(3);
    });

    it('handles invalid localStorage data gracefully', () => {
      localStorage.setItem('marketplace_cart', 'invalid-json');

      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.cartItems).toEqual([]);
    });
  });

  describe('notification', () => {
    it('provides initial notification state as hidden', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.notification).toEqual({
        show: false,
        product: null,
      });
    });

    it('shows notification when product is added to cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      expect(result.current.notification.show).toBe(true);
      expect(result.current.notification.product).toEqual(mockProduct);
    });

    it('updates notification with new product when another is added', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      expect(result.current.notification.product.id).toBe(mockProduct.id);

      act(() => {
        result.current.addToCart(mockProduct2);
      });

      expect(result.current.notification.product.id).toBe(mockProduct2.id);
    });

    it('hides notification when hideNotification is called', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      expect(result.current.notification.show).toBe(true);

      act(() => {
        result.current.hideNotification();
      });

      expect(result.current.notification).toEqual({
        show: false,
        product: null,
      });
    });
  });
});
