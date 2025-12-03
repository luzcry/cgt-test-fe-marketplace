import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock ModelViewer component since Three.js requires WebGL
jest.mock('./components/ModelViewer', () => {
  return function MockModelViewer({ model, productName }) {
    return (
      <div
        data-testid="model-viewer"
        role="img"
        aria-label={`Interactive 3D model of ${productName}. Use mouse to rotate and zoom.`}
      >
        {model && <span data-testid="model-name">{model.name}</span>}
      </div>
    );
  };
});

// Mock ModelPreview component since Three.js requires WebGL
jest.mock('./components/ModelPreview', () => {
  return function MockModelPreview({ model, alt }) {
    return (
      <div data-testid="model-preview" aria-label={alt}>
        {model && <span data-testid="model-preview-name">{model.name}</span>}
      </div>
    );
  };
});

// Use actual product IDs from the updated product data
const PRODUCT_1_ID = 'tactical-soldier';

const renderApp = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
};

describe('App', () => {
  // Clear localStorage before each test to prevent cart persistence
  beforeEach(() => {
    localStorage.clear();
  });

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
    it('renders home page at /', async () => {
      renderApp('/');
      expect(await screen.findByText('Next-Gen')).toBeInTheDocument();
      expect(screen.getByText('3D Assets')).toBeInTheDocument();
    });

    it('renders product page at /products/:id', async () => {
      renderApp(`/products/${PRODUCT_1_ID}`);
      expect(
        await screen.findByRole('heading', { name: 'Tactical Combat Soldier' })
      ).toBeInTheDocument();
    });

    it('renders cart page at /cart', async () => {
      renderApp('/cart');
      expect(await screen.findByText('Your Cart is Empty')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('shows products on home page', async () => {
      renderApp('/');
      expect(
        await screen.findByText('Tactical Combat Soldier')
      ).toBeInTheDocument();
      expect(screen.getByText('Classic Toy Car Model')).toBeInTheDocument();
    });

    it('cart button is present', async () => {
      renderApp('/');
      // Wait for page to load, then check header cart button
      await screen.findByText('Next-Gen');
      expect(
        screen.getByRole('link', { name: /shopping cart/i })
      ).toBeInTheDocument();
    });
  });
});
