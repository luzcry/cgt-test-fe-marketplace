import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import Header from '../components/Header';

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <CartProvider>
        <Header />
      </CartProvider>
    </BrowserRouter>
  );
};

describe('Header', () => {
  it('renders the shop name', () => {
    renderHeader();
    expect(screen.getByText('90s Shop')).toBeInTheDocument();
  });

  it('renders home link', () => {
    renderHeader();
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders cart link with count', () => {
    renderHeader();
    const cartLink = screen.getByRole('link', { name: /cart \(0\)/i });
    expect(cartLink).toBeInTheDocument();
    expect(cartLink).toHaveAttribute('href', '/cart');
  });

  it('renders logo link to home', () => {
    renderHeader();
    const logoLink = screen.getByRole('link', { name: /90s shop/i });
    expect(logoLink).toHaveAttribute('href', '/');
  });
});
