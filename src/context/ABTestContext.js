import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

/**
 * A/B Testing Context
 *
 * Provides a lightweight A/B testing infrastructure for running experiments.
 * Features:
 * - Persistent user assignment via localStorage
 * - Deterministic variant assignment based on user ID
 * - Analytics event tracking
 * - Support for multiple concurrent experiments
 */

const ABTestContext = createContext(null);

// Experiment configurations
export const EXPERIMENTS = {
  CART_NOTIFICATION_STYLE: {
    id: 'cart_notification_style',
    variants: ['control', 'minimal', 'prominent'],
    // control: Current design with two buttons
    // minimal: Simplified single-button design
    // prominent: Larger notification with checkout emphasis
  },
  PRODUCT_CARD_CTA: {
    id: 'product_card_cta',
    variants: ['control', 'quick_add', 'price_in_button'],
    // control: "Add to Cart" with cart icon
    // quick_add: "Quick Add" with plus icon, more compact
    // price_in_button: "Add • $XX" showing price in button
  },
};

/**
 * Generate a persistent user ID for experiment assignment
 * Uses localStorage to maintain consistent experience across sessions
 */
function getOrCreateUserId() {
  const STORAGE_KEY = 'ab_test_user_id';
  let userId = localStorage.getItem(STORAGE_KEY);

  if (!userId) {
    // Generate a simple unique ID
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(STORAGE_KEY, userId);
  }

  return userId;
}

/**
 * Deterministic hash function for consistent variant assignment
 * Same user + experiment always gets the same variant
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Assign a variant to a user for a given experiment
 */
function assignVariant(userId, experiment) {
  const hash = hashString(`${userId}_${experiment.id}`);
  const variantIndex = hash % experiment.variants.length;
  return experiment.variants[variantIndex];
}

/**
 * Get stored variant assignments from localStorage
 */
function getStoredAssignments() {
  try {
    const stored = localStorage.getItem('ab_test_assignments');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Store variant assignments to localStorage
 */
function storeAssignments(assignments) {
  try {
    localStorage.setItem('ab_test_assignments', JSON.stringify(assignments));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function ABTestProvider({ children }) {
  const [userId] = useState(getOrCreateUserId);
  const [assignments, setAssignments] = useState(getStoredAssignments);
  const [trackedEvents, setTrackedEvents] = useState([]);

  // Initialize assignments for all experiments
  useEffect(() => {
    const newAssignments = { ...assignments };
    let hasChanges = false;

    Object.values(EXPERIMENTS).forEach((experiment) => {
      if (!newAssignments[experiment.id]) {
        newAssignments[experiment.id] = assignVariant(userId, experiment);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setAssignments(newAssignments);
      storeAssignments(newAssignments);
    }
  }, [userId, assignments]);

  /**
   * Get the assigned variant for an experiment
   */
  const getVariant = useCallback(
    (experimentId) => {
      return assignments[experimentId] || 'control';
    },
    [assignments]
  );

  /**
   * Track an experiment event (exposure, conversion, etc.)
   * In production, this would send to an analytics service
   */
  const trackEvent = useCallback(
    (experimentId, eventType, metadata = {}) => {
      const event = {
        experimentId,
        variant: assignments[experimentId],
        eventType,
        metadata,
        timestamp: new Date().toISOString(),
        userId,
      };

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[A/B Test Event]', event);
      }

      // Store events (in production, send to analytics service)
      setTrackedEvents((prev) => [...prev, event]);

      // Example: Send to analytics endpoint
      // fetch('/api/analytics/ab-test', {
      //   method: 'POST',
      //   body: JSON.stringify(event),
      // });

      return event;
    },
    [assignments, userId]
  );

  /**
   * Track when a user is exposed to an experiment variant
   */
  const trackExposure = useCallback(
    (experimentId) => {
      return trackEvent(experimentId, 'exposure');
    },
    [trackEvent]
  );

  /**
   * Track a conversion event for an experiment
   */
  const trackConversion = useCallback(
    (experimentId, conversionType, metadata = {}) => {
      return trackEvent(experimentId, 'conversion', {
        conversionType,
        ...metadata,
      });
    },
    [trackEvent]
  );

  /**
   * Force a specific variant (useful for testing/debugging)
   */
  const forceVariant = useCallback((experimentId, variant) => {
    setAssignments((prev) => {
      const updated = { ...prev, [experimentId]: variant };
      storeAssignments(updated);
      return updated;
    });
  }, []);

  /**
   * Reset all assignments (useful for testing)
   */
  const resetAssignments = useCallback(() => {
    localStorage.removeItem('ab_test_assignments');
    localStorage.removeItem('ab_test_user_id');
    setAssignments({});
  }, []);

  const value = useMemo(
    () => ({
      userId,
      assignments,
      getVariant,
      trackEvent,
      trackExposure,
      trackConversion,
      forceVariant,
      resetAssignments,
      trackedEvents,
      experiments: EXPERIMENTS,
    }),
    [
      userId,
      assignments,
      getVariant,
      trackEvent,
      trackExposure,
      trackConversion,
      forceVariant,
      resetAssignments,
      trackedEvents,
    ]
  );

  return (
    <ABTestContext.Provider value={value}>{children}</ABTestContext.Provider>
  );
}

/**
 * Hook to access A/B testing context
 */
export function useABTest() {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within an ABTestProvider');
  }
  return context;
}

/**
 * Hook to get variant and auto-track exposure for a specific experiment
 */
export function useExperiment(experimentId) {
  const { getVariant, trackExposure, trackConversion } = useABTest();
  const variant = getVariant(experimentId);

  // Track exposure on mount
  useEffect(() => {
    trackExposure(experimentId);
  }, [experimentId, trackExposure]);

  const trackConversionForExperiment = useCallback(
    (conversionType, metadata) => {
      trackConversion(experimentId, conversionType, metadata);
    },
    [experimentId, trackConversion]
  );

  return {
    variant,
    trackConversion: trackConversionForExperiment,
    isControl: variant === 'control',
  };
}

export default ABTestContext;
