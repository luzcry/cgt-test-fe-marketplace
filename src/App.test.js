import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Use actual product IDs from the updated product data
const PRODUCT_1_ID = 'cyber-warrior';

const renderApp = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
};

describe('App', () => {
  describe('Layout', () => {
    it('renders header on all pages', () => {
      renderApp();
      expect(screen.getByText('NEXUS')).toBeInTheDocument();
      // "3D" appears in multiple places, check within header brand
      const brandSecondary = document.querySelector('.header__brand-secondary');
      expect(brandSecondary).toHaveTextContent('3D');
    });

    it('renders navigation links', () => {
      renderApp();
      expect(screen.getByRole('link', { name: /browse/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument();
    });
  });

  describe('Routing', () => {
    it('renders home page at /', () => {
      renderApp('/');
      expect(screen.getByText('Next-Gen')).toBeInTheDocument();
      expect(screen.getByText('3D Assets')).toBeInTheDocument();
    });

    it('renders product page at /products/:id', () => {
      renderApp(`/products/${PRODUCT_1_ID}`);
      expect(screen.getByRole('heading', { name: 'Cyber Warrior' })).toBeInTheDocument();
    });

    it('renders cart page at /cart', () => {
      renderApp('/cart');
      expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('shows products on home page', () => {
      renderApp('/');
      expect(screen.getByText('Cyber Warrior')).toBeInTheDocument();
      expect(screen.getByText('Hover Bike X-7')).toBeInTheDocument();
    });

    it('cart button is present', () => {
      renderApp('/');
      expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument();
    });
  });
});
