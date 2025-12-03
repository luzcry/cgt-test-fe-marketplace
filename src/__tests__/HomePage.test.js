import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from '../context/CartContext';
import HomePage from '../pages/HomePage';
import { products } from '../data/products';

// Mock ModelPreview component since Three.js requires WebGL
jest.mock('../components/ModelPreview', () => {
  return function MockModelPreview({ model, fallbackImage, previewColor, alt }) {
    return (
      <div
        data-testid="model-preview"
        className="model-preview"
        style={{ '--preview-color': previewColor }}
      >
        {fallbackImage && (
          <img
            src={fallbackImage}
            alt={alt}
            data-testid="model-preview-fallback"
          />
        )}
        {model && <span data-testid="model-preview-name">{model.name}</span>}
      </div>
    );
  };
});

const renderHomePage = () => {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        <CartProvider>
          <HomePage />
        </CartProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

describe('HomePage', () => {
  describe('Hero section', () => {
    it('renders hero title', () => {
      renderHomePage();
      expect(screen.getByText('Next-Gen')).toBeInTheDocument();
      expect(screen.getByText('3D Assets')).toBeInTheDocument();
    });

    it('renders hero badge', () => {
      renderHomePage();
      expect(screen.getByText('Premium 3D Marketplace')).toBeInTheDocument();
    });

    it('renders feature indicators', () => {
      renderHomePage();
      expect(screen.getByText('High-Poly Models')).toBeInTheDocument();
      expect(screen.getByText('PBR Textures')).toBeInTheDocument();
      expect(screen.getByText('Multi-Format')).toBeInTheDocument();
    });

    it('displays total product count', () => {
      renderHomePage();
      expect(screen.getByText(`${products.length}`)).toBeInTheDocument();
    });
  });

  describe('Products section', () => {
    it('renders products title', () => {
      renderHomePage();
      expect(screen.getByRole('heading', { name: 'All Models' })).toBeInTheDocument();
    });

    it('renders all products', () => {
      renderHomePage();
      // Test with actual product names from updated data
      expect(screen.getByText('Tactical Combat Soldier')).toBeInTheDocument();
      expect(screen.getByText('Classic Toy Car Model')).toBeInTheDocument();
    });

    it('renders product prices', () => {
      renderHomePage();
      // Use getAllByText since multiple products may have the same price
      expect(screen.getAllByText('$89').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('$129')).toBeInTheDocument();
    });

    it('renders product links', () => {
      renderHomePage();
      const productLinks = screen.getAllByRole('link', { name: /view .+ details/i });
      expect(productLinks.length).toBeGreaterThanOrEqual(2);
    });

    it('renders product categories', () => {
      renderHomePage();
      expect(screen.getAllByText('Characters').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Vehicles').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Filter functionality', () => {
    it('renders search input', () => {
      renderHomePage();
      expect(screen.getByPlaceholderText(/search models/i)).toBeInTheDocument();
    });

    it('filters products by search term', () => {
      renderHomePage();
      const searchInput = screen.getByPlaceholderText(/search models/i);

      // Initially all products should be visible
      expect(screen.getByText('Tactical Combat Soldier')).toBeInTheDocument();

      // Search for specific product
      fireEvent.change(searchInput, { target: { value: 'tactical' } });
      expect(screen.getByText('Tactical Combat Soldier')).toBeInTheDocument();
    });

    it('shows filter toggle button on mobile', () => {
      const { container } = renderHomePage();
      // The filter toggle button with class .products__filter-toggle
      const filterToggle = container.querySelector('.products__filter-toggle');
      expect(filterToggle).toBeInTheDocument();
    });

    it('displays product count after filtering', () => {
      renderHomePage();
      // Check that count shows "X of Y models"
      expect(screen.getByText(/of \d+ models/i)).toBeInTheDocument();
    });
  });

  describe('Add to cart functionality', () => {
    it('renders add to cart buttons', () => {
      renderHomePage();
      const addButtons = screen.getAllByRole('button', { name: /add .+ to cart/i });
      expect(addButtons.length).toBe(products.length);
    });

    it('add to cart button is clickable', () => {
      renderHomePage();
      const addButton = screen.getByRole('button', { name: /add tactical combat soldier to cart/i });
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

    it('has search input with accessible label', () => {
      renderHomePage();
      expect(screen.getByLabelText(/search products/i)).toBeInTheDocument();
    });

    it('has product grid with list role', () => {
      renderHomePage();
      expect(screen.getByRole('list', { name: /product listings/i })).toBeInTheDocument();
    });
  });

  describe('SEO', () => {
    it('renders product cards with schema markup', () => {
      const { container } = renderHomePage();
      const productArticles = container.querySelectorAll('[itemtype="https://schema.org/Product"]');
      expect(productArticles.length).toBe(products.length);
    });
  });
});
