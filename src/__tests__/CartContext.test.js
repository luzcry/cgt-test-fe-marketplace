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
  describe('useCart hook', () => {
    it('throws error when used outside CartProvider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

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
});
