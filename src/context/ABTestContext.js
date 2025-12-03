import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

const ABTestContext = createContext(null);

export const EXPERIMENTS = {
  CART_NOTIFICATION_STYLE: {
    id: 'cart_notification_style',
    variants: ['control', 'minimal', 'prominent'],
  },
  PRODUCT_CARD_CTA: {
    id: 'product_card_cta',
    variants: ['control', 'quick_add', 'price_in_button'],
  },
};

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

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function assignVariant(userId, experiment) {
  const hash = hashString(`${userId}_${experiment.id}`);
  const variantIndex = hash % experiment.variants.length;
  return experiment.variants[variantIndex];
}

function getStoredAssignments() {
  try {
    const stored = localStorage.getItem('ab_test_assignments');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function storeAssignments(assignments) {
  try {
    localStorage.setItem('ab_test_assignments', JSON.stringify(assignments));
  } catch {
    // localStorage unavailable
  }
}

export function ABTestProvider({ children }) {
  const [userId] = useState(getOrCreateUserId);
  const [assignments, setAssignments] = useState(getStoredAssignments);
  const [trackedEvents, setTrackedEvents] = useState([]);

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

  const getVariant = useCallback(
    (experimentId) => {
      return assignments[experimentId] || 'control';
    },
    [assignments]
  );

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

      if (process.env.NODE_ENV === 'development') {
        console.log('[A/B Test Event]', event);
      }

      setTrackedEvents((prev) => [...prev, event]);

      return event;
    },
    [assignments, userId]
  );

  const trackExposure = useCallback(
    (experimentId) => {
      return trackEvent(experimentId, 'exposure');
    },
    [trackEvent]
  );

  const trackConversion = useCallback(
    (experimentId, conversionType, metadata = {}) => {
      return trackEvent(experimentId, 'conversion', {
        conversionType,
        ...metadata,
      });
    },
    [trackEvent]
  );

  const forceVariant = useCallback((experimentId, variant) => {
    setAssignments((prev) => {
      const updated = { ...prev, [experimentId]: variant };
      storeAssignments(updated);
      return updated;
    });
  }, []);

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

export function useABTest() {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within an ABTestProvider');
  }
  return context;
}

export function useExperiment(experimentId) {
  const { getVariant, trackExposure, trackConversion } = useABTest();
  const variant = getVariant(experimentId);

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
