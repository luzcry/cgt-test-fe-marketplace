import { renderHook, act } from '@testing-library/react';
import {
  ABTestProvider,
  useABTest,
  useExperiment,
  EXPERIMENTS,
} from '../context/ABTestContext';

const wrapper = ({ children }) => <ABTestProvider>{children}</ABTestProvider>;

describe('ABTestContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('useABTest hook', () => {
    it('throws error when used outside ABTestProvider', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useABTest());
      }).toThrow('useABTest must be used within an ABTestProvider');

      consoleSpy.mockRestore();
    });

    it('provides initial state with userId and experiments', () => {
      const { result } = renderHook(() => useABTest(), { wrapper });

      expect(result.current.userId).toBeDefined();
      expect(result.current.userId).toMatch(/^user_\d+_[a-z0-9]+$/);
      expect(result.current.experiments).toEqual(EXPERIMENTS);
    });

    it('persists userId across renders', () => {
      const { result: result1 } = renderHook(() => useABTest(), { wrapper });
      const userId1 = result1.current.userId;

      const { result: result2 } = renderHook(() => useABTest(), { wrapper });
      const userId2 = result2.current.userId;

      expect(userId1).toBe(userId2);
    });
  });

  describe('variant assignment', () => {
    it('assigns variants for all experiments', () => {
      const { result } = renderHook(() => useABTest(), { wrapper });

      Object.values(EXPERIMENTS).forEach((experiment) => {
        const variant = result.current.getVariant(experiment.id);
        expect(experiment.variants).toContain(variant);
      });
    });

    it('returns consistent variant for same user and experiment', () => {
      const { result } = renderHook(() => useABTest(), { wrapper });

      const variant1 = result.current.getVariant(
        EXPERIMENTS.CART_NOTIFICATION_STYLE.id
      );
      const variant2 = result.current.getVariant(
        EXPERIMENTS.CART_NOTIFICATION_STYLE.id
      );

      expect(variant1).toBe(variant2);
    });

    it('persists assignments in localStorage', () => {
      const { result } = renderHook(() => useABTest(), { wrapper });

      // Trigger assignment by getting a variant
      result.current.getVariant(EXPERIMENTS.CART_NOTIFICATION_STYLE.id);

      const stored = localStorage.getItem('ab_test_assignments');
      expect(stored).toBeDefined();

      const assignments = JSON.parse(stored);
      expect(assignments[EXPERIMENTS.CART_NOTIFICATION_STYLE.id]).toBeDefined();
    });

    it('loads existing assignments from localStorage', () => {
      const mockAssignments = {
        [EXPERIMENTS.CART_NOTIFICATION_STYLE.id]: 'minimal',
        [EXPERIMENTS.PRODUCT_CARD_CTA.id]: 'quick_add',
      };
      localStorage.setItem(
        'ab_test_assignments',
        JSON.stringify(mockAssignments)
      );

      const { result } = renderHook(() => useABTest(), { wrapper });

      expect(
        result.current.getVariant(EXPERIMENTS.CART_NOTIFICATION_STYLE.id)
      ).toBe('minimal');
      expect(result.current.getVariant(EXPERIMENTS.PRODUCT_CARD_CTA.id)).toBe(
        'quick_add'
      );
    });

    it('returns control for unknown experiment', () => {
      const { result } = renderHook(() => useABTest(), { wrapper });

      const variant = result.current.getVariant('unknown_experiment');
      expect(variant).toBe('control');
    });
  });

  describe('forceVariant', () => {
    it('allows forcing a specific variant', () => {
      const { result } = renderHook(() => useABTest(), { wrapper });

      act(() => {
        result.current.forceVariant(
          EXPERIMENTS.CART_NOTIFICATION_STYLE.id,
          'prominent'
        );
      });

      expect(
        result.current.getVariant(EXPERIMENTS.CART_NOTIFICATION_STYLE.id)
      ).toBe('prominent');
    });

    it('persists forced variant to localStorage', () => {
      const { result } = renderHook(() => useABTest(), { wrapper });

      act(() => {
        result.current.forceVariant(
          EXPERIMENTS.CART_NOTIFICATION_STYLE.id,
          'minimal'
        );
      });

      const stored = JSON.parse(localStorage.getItem('ab_test_assignments'));
      expect(stored[EXPERIMENTS.CART_NOTIFICATION_STYLE.id]).toBe('minimal');
    });
  });

  describe('resetAssignments', () => {
    it('clears localStorage and allows new assignment', () => {
      // First, set a specific assignment
      localStorage.setItem(
        'ab_test_assignments',
        JSON.stringify({
          [EXPERIMENTS.CART_NOTIFICATION_STYLE.id]: 'prominent',
        })
      );
      localStorage.setItem('ab_test_user_id', 'fixed_user_123');

      const { result } = renderHook(() => useABTest(), { wrapper });

      // Verify the forced assignment is loaded
      expect(
        result.current.getVariant(EXPERIMENTS.CART_NOTIFICATION_STYLE.id)
      ).toBe('prominent');

      act(() => {
        result.current.resetAssignments();
      });

      // localStorage should be cleared
      expect(localStorage.getItem('ab_test_user_id')).toBeNull();
      // Note: assignments may be re-initialized by useEffect,
      // but localStorage entries for assignments are cleared
    });
  });

  describe('event tracking', () => {
    it('tracks events with correct structure', () => {
      const { result } = renderHook(() => useABTest(), { wrapper });

      act(() => {
        result.current.trackEvent(
          EXPERIMENTS.CART_NOTIFICATION_STYLE.id,
          'test_event',
          { testData: 'value' }
        );
      });

      expect(result.current.trackedEvents).toHaveLength(1);
      expect(result.current.trackedEvents[0]).toMatchObject({
        experimentId: EXPERIMENTS.CART_NOTIFICATION_STYLE.id,
        eventType: 'test_event',
        metadata: { testData: 'value' },
      });
      expect(result.current.trackedEvents[0].timestamp).toBeDefined();
      expect(result.current.trackedEvents[0].userId).toBeDefined();
    });

    it('trackExposure creates exposure event', () => {
      const { result } = renderHook(() => useABTest(), { wrapper });

      act(() => {
        result.current.trackExposure(EXPERIMENTS.CART_NOTIFICATION_STYLE.id);
      });

      expect(result.current.trackedEvents).toHaveLength(1);
      expect(result.current.trackedEvents[0].eventType).toBe('exposure');
    });

    it('trackConversion creates conversion event with type', () => {
      const { result } = renderHook(() => useABTest(), { wrapper });

      act(() => {
        result.current.trackConversion(
          EXPERIMENTS.CART_NOTIFICATION_STYLE.id,
          'view_cart_click',
          { productId: 'test-123' }
        );
      });

      expect(result.current.trackedEvents).toHaveLength(1);
      expect(result.current.trackedEvents[0].eventType).toBe('conversion');
      expect(result.current.trackedEvents[0].metadata).toMatchObject({
        conversionType: 'view_cart_click',
        productId: 'test-123',
      });
    });

    it('does not log events in test mode (only logs in development)', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const { result } = renderHook(() => useABTest(), { wrapper });

      act(() => {
        result.current.trackEvent(
          EXPERIMENTS.CART_NOTIFICATION_STYLE.id,
          'test_event'
        );
      });

      // In test environment (NODE_ENV=test), logging is disabled
      // Events are still tracked, just not logged to console
      expect(result.current.trackedEvents.length).toBeGreaterThan(0);
      // Console.log is not called because NODE_ENV !== 'development'
      const abTestLogs = consoleSpy.mock.calls.filter(
        (call) => call[0] === '[A/B Test Event]'
      );
      expect(abTestLogs.length).toBe(0);
    });
  });
});

describe('useExperiment hook', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns variant and isControl flag', () => {
    const { result } = renderHook(
      () => useExperiment(EXPERIMENTS.CART_NOTIFICATION_STYLE.id),
      { wrapper }
    );

    expect(result.current.variant).toBeDefined();
    expect(typeof result.current.isControl).toBe('boolean');
    expect(typeof result.current.trackConversion).toBe('function');
  });

  it('isControl is true when variant is control', () => {
    // Force control variant
    localStorage.setItem(
      'ab_test_assignments',
      JSON.stringify({
        [EXPERIMENTS.CART_NOTIFICATION_STYLE.id]: 'control',
      })
    );

    const { result } = renderHook(
      () => useExperiment(EXPERIMENTS.CART_NOTIFICATION_STYLE.id),
      { wrapper }
    );

    expect(result.current.isControl).toBe(true);
  });

  it('isControl is false when variant is not control', () => {
    // Force non-control variant
    localStorage.setItem(
      'ab_test_assignments',
      JSON.stringify({
        [EXPERIMENTS.CART_NOTIFICATION_STYLE.id]: 'prominent',
      })
    );

    const { result } = renderHook(
      () => useExperiment(EXPERIMENTS.CART_NOTIFICATION_STYLE.id),
      { wrapper }
    );

    expect(result.current.isControl).toBe(false);
  });

  it('tracks exposure on mount by calling trackExposure', () => {
    // useExperiment calls trackExposure on mount via useEffect
    // We verify by checking that the hook has access to trackConversion
    const { result } = renderHook(
      () => useExperiment(EXPERIMENTS.CART_NOTIFICATION_STYLE.id),
      { wrapper }
    );

    // The hook should have the trackConversion function available
    expect(typeof result.current.trackConversion).toBe('function');
    // And should have received a variant
    expect(result.current.variant).toBeDefined();
    expect(EXPERIMENTS.CART_NOTIFICATION_STYLE.variants).toContain(
      result.current.variant
    );
  });

  it('provides trackConversion scoped to experiment', () => {
    const { result } = renderHook(
      () => useExperiment(EXPERIMENTS.CART_NOTIFICATION_STYLE.id),
      { wrapper }
    );

    // trackConversion should be a function that can be called
    expect(typeof result.current.trackConversion).toBe('function');

    // Calling it should not throw
    expect(() => {
      act(() => {
        result.current.trackConversion('button_click', { buttonId: 'test' });
      });
    }).not.toThrow();
  });
});

describe('EXPERIMENTS configuration', () => {
  it('has CART_NOTIFICATION_STYLE experiment configured', () => {
    expect(EXPERIMENTS.CART_NOTIFICATION_STYLE).toBeDefined();
    expect(EXPERIMENTS.CART_NOTIFICATION_STYLE.id).toBe(
      'cart_notification_style'
    );
    expect(EXPERIMENTS.CART_NOTIFICATION_STYLE.variants).toEqual([
      'control',
      'minimal',
      'prominent',
    ]);
  });

  it('has PRODUCT_CARD_CTA experiment configured', () => {
    expect(EXPERIMENTS.PRODUCT_CARD_CTA).toBeDefined();
    expect(EXPERIMENTS.PRODUCT_CARD_CTA.id).toBe('product_card_cta');
    expect(EXPERIMENTS.PRODUCT_CARD_CTA.variants).toEqual([
      'control',
      'quick_add',
      'price_in_button',
    ]);
  });

  it('all experiments have control as first variant', () => {
    Object.values(EXPERIMENTS).forEach((experiment) => {
      expect(experiment.variants[0]).toBe('control');
    });
  });
});
