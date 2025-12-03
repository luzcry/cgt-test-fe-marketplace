import { render, screen, within } from '@testing-library/react';
import FeatureList, { FeatureItem } from '../components/Feature';

describe('FeatureItem Component', () => {
  describe('Rendering', () => {
    it('renders with children text', () => {
      render(<FeatureItem>Feature text</FeatureItem>);
      expect(screen.getByText('Feature text')).toBeInTheDocument();
    });

    it('renders text in feature__text span', () => {
      render(<FeatureItem>Feature text</FeatureItem>);
      const textElement = screen.getByText('Feature text');
      expect(textElement).toHaveClass('feature__text');
    });

    it('applies feature class to container', () => {
      render(<FeatureItem data-testid="feature-item">Test</FeatureItem>);
      expect(screen.getByTestId('feature-item')).toHaveClass('feature');
    });
  });

  describe('Icon types', () => {
    it('renders check icon by default', () => {
      render(<FeatureItem data-testid="feature-item">With check</FeatureItem>);
      const featureItem = screen.getByTestId('feature-item');
      expect(featureItem.innerHTML).toContain('feature__icon-svg');
    });

    it('renders dot icon when icon="dot"', () => {
      render(
        <FeatureItem icon="dot" data-testid="feature-item">
          With dot
        </FeatureItem>
      );
      const featureItem = screen.getByTestId('feature-item');
      expect(featureItem.innerHTML).toContain('feature__dot');
    });

    it('renders custom icon when passed as React element', () => {
      const CustomIcon = () => <span data-testid="custom-icon">★</span>;
      render(<FeatureItem icon={<CustomIcon />}>Custom</FeatureItem>);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('icon container has aria-hidden', () => {
      render(<FeatureItem data-testid="feature-item">Test</FeatureItem>);
      const featureItem = screen.getByTestId('feature-item');
      expect(featureItem.innerHTML).toContain('aria-hidden="true"');
    });
  });

  describe('Custom classNames', () => {
    it('accepts custom className', () => {
      render(
        <FeatureItem className="custom-feature" data-testid="feature-item">
          Test
        </FeatureItem>
      );
      expect(screen.getByTestId('feature-item')).toHaveClass('custom-feature');
    });

    it('preserves feature class with custom className', () => {
      render(
        <FeatureItem className="custom-feature" data-testid="feature-item">
          Test
        </FeatureItem>
      );
      const featureItem = screen.getByTestId('feature-item');
      expect(featureItem).toHaveClass('feature');
      expect(featureItem).toHaveClass('custom-feature');
    });

    it('accepts iconClassName for icon', () => {
      render(
        <FeatureItem iconClassName="custom-icon-class" data-testid="feature-item">
          Test
        </FeatureItem>
      );
      const featureItem = screen.getByTestId('feature-item');
      expect(featureItem.innerHTML).toContain('custom-icon-class');
    });
  });
});

describe('FeatureList Component', () => {
  const mockFeatures = ['Feature 1', 'Feature 2', 'Feature 3'];

  describe('Rendering', () => {
    it('renders all features', () => {
      render(<FeatureList features={mockFeatures} />);

      mockFeatures.forEach((feature) => {
        expect(screen.getByText(feature)).toBeInTheDocument();
      });
    });

    it('renders correct number of FeatureItems', () => {
      render(<FeatureList features={mockFeatures} data-testid="feature-list" />);
      const featureList = screen.getByTestId('feature-list');

      expect(within(featureList).getByText('Feature 1')).toBeInTheDocument();
      expect(within(featureList).getByText('Feature 2')).toBeInTheDocument();
      expect(within(featureList).getByText('Feature 3')).toBeInTheDocument();
    });

    it('applies feature-list class to container', () => {
      render(<FeatureList features={mockFeatures} data-testid="feature-list" />);
      expect(screen.getByTestId('feature-list')).toHaveClass('feature-list');
    });
  });

  describe('Direction', () => {
    it('applies column direction by default', () => {
      render(<FeatureList features={mockFeatures} data-testid="feature-list" />);
      expect(screen.getByTestId('feature-list')).toHaveClass(
        'feature-list--column'
      );
    });

    it('applies row direction when specified', () => {
      render(
        <FeatureList
          features={mockFeatures}
          direction="row"
          data-testid="feature-list"
        />
      );
      expect(screen.getByTestId('feature-list')).toHaveClass('feature-list--row');
    });
  });

  describe('Icon prop', () => {
    it('passes icon type to all FeatureItems', () => {
      render(
        <FeatureList
          features={mockFeatures}
          icon="dot"
          data-testid="feature-list"
        />
      );
      const featureList = screen.getByTestId('feature-list');
      // Count dot icons in the HTML
      const dotMatches = featureList.innerHTML.match(/feature__dot/g);
      expect(dotMatches).toHaveLength(3);
    });

    it('passes custom icon to all FeatureItems', () => {
      const CustomIcon = () => <span data-testid="custom-icon">★</span>;
      render(<FeatureList features={mockFeatures} icon={<CustomIcon />} />);
      const icons = screen.getAllByTestId('custom-icon');
      expect(icons).toHaveLength(3);
    });
  });

  describe('Custom classNames', () => {
    it('accepts custom className for container', () => {
      render(
        <FeatureList
          features={mockFeatures}
          className="custom-list"
          data-testid="feature-list"
        />
      );
      expect(screen.getByTestId('feature-list')).toHaveClass('custom-list');
    });

    it('accepts itemClassName for all items', () => {
      render(
        <FeatureList
          features={mockFeatures}
          itemClassName="custom-item"
          data-testid="feature-list"
        />
      );
      const featureList = screen.getByTestId('feature-list');
      const customItemMatches = featureList.innerHTML.match(/custom-item/g);
      expect(customItemMatches).toHaveLength(3);
    });
  });

  describe('Keys', () => {
    it('uses string features as keys', () => {
      // This test verifies no console warnings about missing keys
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(<FeatureList features={mockFeatures} />);

      const keyWarning = consoleSpy.mock.calls.find((call) =>
        call[0]?.includes?.('key')
      );
      expect(keyWarning).toBeUndefined();

      consoleSpy.mockRestore();
    });

    it('handles React node features with index keys', () => {
      const nodeFeatures = [
        <span key="a">Feature A</span>,
        <span key="b">Feature B</span>,
      ];

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(<FeatureList features={nodeFeatures} />);

      const keyWarning = consoleSpy.mock.calls.find((call) =>
        call[0]?.includes?.('key')
      );
      expect(keyWarning).toBeUndefined();

      consoleSpy.mockRestore();
    });
  });

  describe('Empty state', () => {
    it('renders empty container with no features', () => {
      render(<FeatureList features={[]} data-testid="feature-list" />);
      const featureList = screen.getByTestId('feature-list');
      // Container should exist but be empty of feature items
      expect(featureList.innerHTML).not.toContain('feature__text');
    });
  });
});

describe('Component displayNames', () => {
  it('FeatureItem has displayName', () => {
    expect(FeatureItem.displayName).toBe('FeatureItem');
  });

  it('FeatureList has displayName', () => {
    expect(FeatureList.displayName).toBe('FeatureList');
  });
});
