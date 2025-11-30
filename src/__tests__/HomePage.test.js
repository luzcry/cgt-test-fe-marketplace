import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  it('renders welcome message', () => {
    renderHomePage();
    expect(screen.getByText('Welcome to our shop!')).toBeInTheDocument();
  });

  it('renders all products', () => {
    renderHomePage();
    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product B')).toBeInTheDocument();
  });

  it('renders product prices', () => {
    renderHomePage();
    expect(screen.getByText('10 USD')).toBeInTheDocument();
    expect(screen.getByText('30 USD')).toBeInTheDocument();
  });

  it('renders product links', () => {
    renderHomePage();
    const productALink = screen.getByRole('link', { name: /product a/i });
    const productBLink = screen.getByRole('link', { name: /product b/i });

    expect(productALink).toHaveAttribute('href', '/products/a');
    expect(productBLink).toHaveAttribute('href', '/products/b');
  });

  it('renders product images with alt text', () => {
    renderHomePage();
    const images = screen.getAllByRole('img');

    expect(images[0]).toHaveAttribute('alt', 'Product A');
    expect(images[1]).toHaveAttribute('alt', 'Product B');
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
