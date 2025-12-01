import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import HomePage from '../pages/HomePage';

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <CartProvider>
        <HomePage />
      </CartProvider>
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  describe('Hero section', () => {
    it('renders hero title', () => {
      renderHomePage();
      expect(screen.getByText('Next-Gen')).toBeInTheDocument();
      expect(screen.getByText('Digital Assets')).toBeInTheDocument();
    });

    it('renders hero badge', () => {
      renderHomePage();
      expect(screen.getByText('Premium Marketplace')).toBeInTheDocument();
    });

    it('renders feature indicators', () => {
      renderHomePage();
      expect(screen.getByText('Premium Quality')).toBeInTheDocument();
      expect(screen.getByText('Instant Download')).toBeInTheDocument();
      expect(screen.getByText('Secure Payment')).toBeInTheDocument();
    });
  });

  describe('Products section', () => {
    it('renders products title', () => {
      renderHomePage();
      expect(screen.getByRole('heading', { name: 'All Products' })).toBeInTheDocument();
    });

    it('renders all products', () => {
      renderHomePage();
      expect(screen.getByText('Product A')).toBeInTheDocument();
      expect(screen.getByText('Product B')).toBeInTheDocument();
    });

    it('renders product prices', () => {
      renderHomePage();
      expect(screen.getByText('$10')).toBeInTheDocument();
      expect(screen.getByText('$30')).toBeInTheDocument();
    });

    it('renders product links', () => {
      renderHomePage();
      const productLinks = screen.getAllByRole('link', { name: /view product/i });
      expect(productLinks.length).toBeGreaterThanOrEqual(2);
    });

    it('renders product categories', () => {
      renderHomePage();
      expect(screen.getByText('Digital Asset')).toBeInTheDocument();
      expect(screen.getByText('Premium Asset')).toBeInTheDocument();
    });

    it('renders product descriptions', () => {
      renderHomePage();
      expect(
        screen.getByText('You are probably interested in this product.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Check out the newest product!')
      ).toBeInTheDocument();
    });
  });

  describe('Add to cart functionality', () => {
    it('renders add to cart buttons', () => {
      renderHomePage();
      const addButtons = screen.getAllByRole('button', { name: /add .+ to cart/i });
      expect(addButtons.length).toBe(2);
    });

    it('add to cart button is clickable', () => {
      renderHomePage();
      const addButton = screen.getByRole('button', { name: /add product a to cart/i });
      expect(addButton).not.toBeDisabled();
      fireEvent.click(addButton);
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      renderHomePage();
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    it('has labeled sections', () => {
      renderHomePage();
      expect(screen.getByRole('region', { name: /products/i })).toBeInTheDocument();
    });
  });
});
