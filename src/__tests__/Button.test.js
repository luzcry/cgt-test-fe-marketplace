import { render, screen, fireEvent, within } from '@testing-library/react';
import { createRef } from 'react';
import { Link, MemoryRouter } from 'react-router-dom';
import Button from '../components/Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders with children text', () => {
      render(<Button>Click me</Button>);
      expect(
        screen.getByRole('button', { name: 'Click me' })
      ).toBeInTheDocument();
    });

    it('renders as button element by default', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders with default type="button"', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('allows custom type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
  });

  describe('Variants', () => {
    it('applies primary variant class by default', () => {
      render(<Button>Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn--primary');
    });

    it('applies secondary variant class', () => {
      render(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn--secondary');
    });

    it('applies ghost variant class', () => {
      render(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn--ghost');
    });

    it('applies icon variant class', () => {
      render(<Button variant="icon">X</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn--icon');
    });
  });

  describe('Sizes', () => {
    it('applies medium size by default', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn--md');
    });

    it('applies small size class', () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn--sm');
    });

    it('applies large size class', () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn--lg');
    });
  });

  describe('Icons', () => {
    const TestIcon = () => <svg data-testid="test-icon" />;

    it('renders icon when provided', () => {
      render(<Button icon={<TestIcon />}>With Icon</Button>);

      const button = screen.getByRole('button');
      expect(within(button).getByTestId('test-icon')).toBeInTheDocument();
    });

    it('renders icon at start position by default', () => {
      render(<Button icon={<TestIcon />}>With Icon</Button>);

      // Icon should appear before text in DOM order
      const button = screen.getByRole('button');
      const buttonHTML = button.innerHTML;
      const iconIndex = buttonHTML.indexOf('test-icon');
      const textIndex = buttonHTML.indexOf('With Icon');

      expect(iconIndex).toBeLessThan(textIndex);
    });

    it('renders icon at end position', () => {
      render(
        <Button icon={<TestIcon />} iconPosition="end">
          With Icon
        </Button>
      );

      // Icon should appear after text in DOM order
      const button = screen.getByRole('button');
      const buttonHTML = button.innerHTML;
      const iconIndex = buttonHTML.indexOf('test-icon');
      const textIndex = buttonHTML.indexOf('With Icon');

      expect(iconIndex).toBeGreaterThan(textIndex);
    });

    it('hides icon when loading', () => {
      render(
        <Button icon={<TestIcon />} isLoading>
          Loading
        </Button>
      );

      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows spinner when loading', () => {
      render(<Button isLoading>Loading</Button>);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('disables button when loading', () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('applies loading class', () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn--loading');
    });

    it('has aria-busy when loading', () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('does not have aria-busy when not loading', () => {
      render(<Button>Normal</Button>);
      expect(screen.getByRole('button')).not.toHaveAttribute('aria-busy');
    });

    it('spinner has screen reader text', () => {
      render(<Button isLoading>Loading</Button>);
      expect(
        screen.getByText('Loading', { selector: '.visually-hidden' })
      ).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('disables button when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('applies disabled class', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn--disabled');
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Events', () => {
    it('calls onClick handler when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when loading', () => {
      const handleClick = jest.fn();
      render(
        <Button isLoading onClick={handleClick}>
          Loading
        </Button>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Custom className', () => {
    it('adds custom className', () => {
      render(<Button className="custom-class">Test</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('preserves base classes with custom className', () => {
      render(<Button className="custom-class">Test</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('btn');
      expect(button).toHaveClass('btn--primary');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Polymorphic "as" prop', () => {
    it('renders as anchor element', () => {
      render(
        <Button as="a" href="/test">
          Link Button
        </Button>
      );

      const link = screen.getByRole('link', { name: 'Link Button' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });

    it('renders as React Router Link', () => {
      render(
        <MemoryRouter>
          <Button as={Link} to="/test">
            Router Link
          </Button>
        </MemoryRouter>
      );

      const link = screen.getByRole('link', { name: 'Router Link' });
      expect(link).toBeInTheDocument();
    });

    it('does not add type attribute to non-button elements', () => {
      render(
        <Button as="a" href="/test">
          Link
        </Button>
      );

      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('type');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to button element', () => {
      const ref = createRef();
      render(<Button ref={ref}>Test</Button>);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('forwards ref to custom element', () => {
      const ref = createRef();
      render(
        <Button as="a" href="/test" ref={ref}>
          Link
        </Button>
      );

      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });
  });

  describe('Icon-only variant', () => {
    it('renders children directly for icon variant', () => {
      render(
        <Button variant="icon">
          <span data-testid="icon-child">X</span>
        </Button>
      );

      // Icon child should be rendered inside button
      const button = screen.getByRole('button');
      expect(within(button).getByTestId('icon-child')).toBeInTheDocument();
    });

    it('does not wrap icon variant children in btn__text', () => {
      render(
        <Button variant="icon">
          <span data-testid="icon-child">X</span>
        </Button>
      );

      const button = screen.getByRole('button');
      // btn__text class should not be present for icon variant
      expect(button.innerHTML).not.toContain('btn__text');
    });
  });

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(<Button aria-label="Close dialog">X</Button>);
      expect(
        screen.getByRole('button', { name: 'Close dialog' })
      ).toBeInTheDocument();
    });

    it('supports aria-expanded', () => {
      render(<Button aria-expanded="true">Toggle</Button>);
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-expanded',
        'true'
      );
    });

    it('supports aria-controls', () => {
      render(<Button aria-controls="menu-id">Menu</Button>);
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-controls',
        'menu-id'
      );
    });
  });
});
