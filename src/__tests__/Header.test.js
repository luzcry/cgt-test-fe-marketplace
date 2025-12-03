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
  it('renders the brand name', () => {
    renderHeader();
    expect(screen.getByText('NEXUS')).toBeInTheDocument();
    expect(screen.getByText('3D')).toBeInTheDocument();
  });

  it('renders browse link', () => {
    renderHeader();
    const browseLink = screen.getByRole('link', { name: /browse/i });
    expect(browseLink).toBeInTheDocument();
    expect(browseLink).toHaveAttribute('href', '/');
  });

  it('renders cart link', () => {
    renderHeader();
    const cartLink = screen.getByRole('link', { name: /cart/i });
    expect(cartLink).toBeInTheDocument();
    expect(cartLink).toHaveAttribute('href', '/cart');
  });

  it('renders logo link to home', () => {
    renderHeader();
    const logoLink = screen.getByRole('link', { name: /nexus3d/i });
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('has accessible navigation', () => {
    renderHeader();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: /main/i })
    ).toBeInTheDocument();
  });
});
