# A/B Testing Documentation

This document describes the A/B testing infrastructure implemented in the 3D Marketplace application.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Current Experiments](#current-experiments)
- [Usage Guide](#usage-guide)
- [Adding New Experiments](#adding-new-experiments)
- [Testing Locally](#testing-locally)
- [Analytics Integration](#analytics-integration)
- [Best Practices](#best-practices)

---

## Overview

The A/B testing system provides a lightweight, client-side experimentation framework for running controlled experiments. It enables:

- **Persistent user assignment**: Users see the same variant across sessions
- **Deterministic bucketing**: Same user always gets the same variant (no flickering)
- **Conversion tracking**: Track user interactions with experiment variants
- **Debug utilities**: Force variants for testing and QA

### Key Files

| File | Purpose |
|------|---------|
| `src/context/ABTestContext.js` | Core A/B testing logic, context provider, and hooks |
| `src/components/CartNotification/` | Cart notification experiment implementation |
| `src/components/ProductCard/` | Product card CTA experiment implementation |
| `src/__tests__/ABTestContext.test.js` | Test suite for A/B testing infrastructure |

---

## Architecture

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        ABTestProvider                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  1. Generate/retrieve userId from localStorage          │    │
│  │  2. Load existing assignments from localStorage         │    │
│  │  3. Assign variants for new experiments (hash-based)    │    │
│  │  4. Persist assignments to localStorage                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Context Value                         │    │
│  │  - userId                                                │    │
│  │  - assignments: { experimentId: variant }               │    │
│  │  - getVariant(experimentId)                             │    │
│  │  - trackExposure(experimentId)                          │    │
│  │  - trackConversion(experimentId, type, metadata)        │    │
│  │  - forceVariant(experimentId, variant)                  │    │
│  │  - resetAssignments()                                   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Component Layer                             │
│  ┌──────────────────────┐    ┌──────────────────────┐          │
│  │   useExperiment()    │    │     useABTest()      │          │
│  │                      │    │                      │          │
│  │  - Auto-tracks       │    │  - Full context      │          │
│  │    exposure          │    │    access            │          │
│  │  - Returns variant   │    │  - Debug utilities   │          │
│  │  - Scoped tracking   │    │                      │          │
│  └──────────────────────┘    └──────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### Variant Assignment Algorithm

Users are assigned to variants using a deterministic hash function:

```javascript
hash(userId + experimentId) % numberOfVariants = variantIndex
```

This ensures:
- Same user always gets the same variant
- Even distribution across variants
- No server-side storage required

---

## Current Experiments

### 1. Cart Notification Style (`cart_notification_style`)

**Location**: `src/components/CartNotification/CartNotification.js`

**Goal**: Optimize post-add-to-cart experience to increase cart views and checkout rate.

| Variant | Description | Hypothesis |
|---------|-------------|------------|
| `control` | Two buttons: "Continue Shopping" + "View Cart" | Baseline measurement |
| `minimal` | Single "View Cart" button, 3s auto-dismiss | Fewer choices = faster decisions |
| `prominent` | Shows cart total + "Checkout Now" primary CTA | Direct path to checkout increases conversion |

**Key Metrics**:
- `view_cart_click`: User clicked "View Cart"
- `checkout_click`: User clicked "Checkout Now" (prominent only)
- `continue_shopping_click`: User dismissed notification

### 2. Product Card CTA (`product_card_cta`)

**Location**: `src/components/ProductCard/ProductCard.js`

**Goal**: Optimize add-to-cart button to increase conversion rate.

| Variant | Description | Hypothesis |
|---------|-------------|------------|
| `control` | "Add to Cart" with cart icon | Baseline measurement |
| `quick_add` | "Quick Add" with plus icon, compact green button | Action-oriented copy increases urgency |
| `price_in_button` | "Add • $XX" showing price in button | Price visibility reduces friction |

**Key Metrics**:
- `add_to_cart`: User clicked the CTA button (includes productId, price)

---

## Usage Guide

### Basic Usage with `useExperiment`

The `useExperiment` hook is the recommended way to implement experiments:

```jsx
import { useExperiment, EXPERIMENTS } from '../context/ABTestContext';

function MyComponent() {
  const { variant, trackConversion, isControl } = useExperiment(
    EXPERIMENTS.MY_EXPERIMENT.id
  );

  const handleClick = () => {
    trackConversion('button_click', { buttonId: 'cta' });
    // ... rest of click handler
  };

  // Render based on variant
  switch (variant) {
    case 'variant_a':
      return <VariantA onClick={handleClick} />;
    case 'variant_b':
      return <VariantB onClick={handleClick} />;
    default:
      return <Control onClick={handleClick} />;
  }
}
```

### Advanced Usage with `useABTest`

For more control, use the full context:

```jsx
import { useABTest } from '../context/ABTestContext';

function DebugPanel() {
  const {
    userId,
    assignments,
    getVariant,
    forceVariant,
    resetAssignments,
    trackedEvents
  } = useABTest();

  return (
    <div>
      <p>User ID: {userId}</p>
      <p>Assignments: {JSON.stringify(assignments)}</p>
      <button onClick={() => forceVariant('my_experiment', 'variant_b')}>
        Force Variant B
      </button>
      <button onClick={resetAssignments}>
        Reset All
      </button>
    </div>
  );
}
```

### Hook API Reference

#### `useExperiment(experimentId)`

| Return Value | Type | Description |
|--------------|------|-------------|
| `variant` | `string` | The assigned variant name |
| `isControl` | `boolean` | `true` if variant is "control" |
| `trackConversion` | `function` | Track conversion: `(type, metadata?) => void` |

#### `useABTest()`

| Return Value | Type | Description |
|--------------|------|-------------|
| `userId` | `string` | Unique user identifier |
| `assignments` | `object` | Map of experimentId to variant |
| `getVariant` | `function` | Get variant: `(experimentId) => string` |
| `trackEvent` | `function` | Track any event: `(experimentId, eventType, metadata?) => void` |
| `trackExposure` | `function` | Track exposure: `(experimentId) => void` |
| `trackConversion` | `function` | Track conversion: `(experimentId, type, metadata?) => void` |
| `forceVariant` | `function` | Force variant: `(experimentId, variant) => void` |
| `resetAssignments` | `function` | Clear all assignments: `() => void` |
| `trackedEvents` | `array` | List of all tracked events |
| `experiments` | `object` | EXPERIMENTS configuration |

---

## Adding New Experiments

### Step 1: Define the Experiment

Add to `EXPERIMENTS` in `src/context/ABTestContext.js`:

```javascript
export const EXPERIMENTS = {
  // ... existing experiments

  CHECKOUT_BUTTON_COLOR: {
    id: 'checkout_button_color',
    variants: ['control', 'green', 'orange'],
    // control: Current blue button
    // green: Green "success" color
    // orange: Orange "urgency" color
  },
};
```

### Step 2: Implement in Component

```jsx
import { useExperiment, EXPERIMENTS } from '../context/ABTestContext';

function CheckoutButton({ onCheckout }) {
  const { variant, trackConversion } = useExperiment(
    EXPERIMENTS.CHECKOUT_BUTTON_COLOR.id
  );

  const handleClick = () => {
    trackConversion('checkout_initiated');
    onCheckout();
  };

  const colorClass = {
    control: 'btn--primary',
    green: 'btn--success',
    orange: 'btn--warning',
  }[variant];

  return (
    <button
      className={`btn ${colorClass}`}
      onClick={handleClick}
      data-variant={variant}
    >
      Checkout
    </button>
  );
}
```

### Step 3: Add Styles (if needed)

```scss
// Add variant-specific styles
.checkout-page--variant-green {
  .checkout-button {
    background: var(--color-success);
  }
}

.checkout-page--variant-orange {
  .checkout-button {
    background: var(--color-warning);
  }
}
```

### Step 4: Update Tests

```javascript
// Force specific variant in tests
const renderWithVariant = (variant) => {
  localStorage.setItem(
    'ab_test_assignments',
    JSON.stringify({ checkout_button_color: variant })
  );

  return render(
    <ABTestProvider>
      <CheckoutButton />
    </ABTestProvider>
  );
};

it('renders green variant correctly', () => {
  renderWithVariant('green');
  expect(screen.getByRole('button')).toHaveClass('btn--success');
});
```

---

## Testing Locally

### Browser Console Commands

```javascript
// View current assignments
JSON.parse(localStorage.getItem('ab_test_assignments'))

// View user ID
localStorage.getItem('ab_test_user_id')

// Force a specific variant
localStorage.setItem('ab_test_assignments', JSON.stringify({
  cart_notification_style: 'prominent',
  product_card_cta: 'price_in_button'
}));
location.reload();

// Reset everything (get new random assignments)
localStorage.removeItem('ab_test_assignments');
localStorage.removeItem('ab_test_user_id');
location.reload();

// View tracked events (in React DevTools or via window)
// Events are logged to console in development mode
```

### Testing Each Variant

To systematically test all variants:

```javascript
// Test cart notification variants
['control', 'minimal', 'prominent'].forEach(variant => {
  localStorage.setItem('ab_test_assignments', JSON.stringify({
    cart_notification_style: variant
  }));
  console.log(`Testing cart notification: ${variant}`);
  location.reload();
});

// Test product card variants
['control', 'quick_add', 'price_in_button'].forEach(variant => {
  localStorage.setItem('ab_test_assignments', JSON.stringify({
    product_card_cta: variant
  }));
  console.log(`Testing product card: ${variant}`);
  location.reload();
});
```

### Unit Testing

Tests automatically force the `control` variant for consistency:

```javascript
beforeEach(() => {
  localStorage.clear();
});

const renderWithABTest = () => {
  localStorage.setItem('ab_test_assignments', JSON.stringify({
    my_experiment: 'control'
  }));

  return render(
    <ABTestProvider>
      <MyComponent />
    </ABTestProvider>
  );
};
```

---

## Analytics Integration

### Event Structure

All tracked events follow this structure:

```typescript
interface ABTestEvent {
  experimentId: string;      // e.g., "cart_notification_style"
  variant: string;           // e.g., "prominent"
  eventType: 'exposure' | 'conversion';
  metadata?: {
    conversionType?: string; // e.g., "checkout_click"
    [key: string]: any;      // Additional data
  };
  timestamp: string;         // ISO 8601 format
  userId: string;            // Persistent user ID
}
```

### Integrating with Analytics Services

To send events to your analytics service, modify `trackEvent` in `ABTestContext.js`:

```javascript
const trackEvent = useCallback((experimentId, eventType, metadata = {}) => {
  const event = {
    experimentId,
    variant: assignments[experimentId],
    eventType,
    metadata,
    timestamp: new Date().toISOString(),
    userId,
  };

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log('[A/B Test Event]', event);
  }

  // Send to analytics service
  // Option 1: Google Analytics 4
  window.gtag?.('event', 'ab_test_event', {
    experiment_id: event.experimentId,
    variant: event.variant,
    event_type: event.eventType,
    ...event.metadata,
  });

  // Option 2: Mixpanel
  window.mixpanel?.track('AB Test Event', event);

  // Option 3: Custom endpoint
  fetch('/api/analytics/ab-test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });

  return event;
}, [assignments, userId]);
```

### Sample Analytics Dashboard Query

```sql
-- Calculate conversion rate by variant
SELECT
  experiment_id,
  variant,
  COUNT(DISTINCT CASE WHEN event_type = 'exposure' THEN user_id END) as exposures,
  COUNT(DISTINCT CASE WHEN event_type = 'conversion' THEN user_id END) as conversions,
  ROUND(
    COUNT(DISTINCT CASE WHEN event_type = 'conversion' THEN user_id END) * 100.0 /
    NULLIF(COUNT(DISTINCT CASE WHEN event_type = 'exposure' THEN user_id END), 0),
    2
  ) as conversion_rate
FROM ab_test_events
WHERE experiment_id = 'cart_notification_style'
GROUP BY experiment_id, variant
ORDER BY variant;
```

---

## Best Practices

### Do's

1. **Always include `control`** as the first variant for baseline measurement
2. **Track conversions with context** - include relevant metadata (productId, price, etc.)
3. **Use semantic variant names** - `prominent` is clearer than `variant_b`
4. **Test all variants locally** before deploying
5. **Document hypotheses** - explain why each variant might perform better
6. **Run experiments for statistical significance** - don't conclude too early

### Don'ts

1. **Don't change variants mid-experiment** - it invalidates results
2. **Don't run overlapping experiments** on the same component without consideration
3. **Don't use A/B tests for critical functionality** - only for optimizations
4. **Don't forget to clean up** - remove experiments after concluding

### Performance Considerations

- Variant assignment happens synchronously on first render
- localStorage operations are fast but avoid excessive reads
- CSS for all variants is bundled; consider code-splitting for complex variants

---

## Troubleshooting

### "useABTest must be used within an ABTestProvider"

Ensure your component is wrapped with `ABTestProvider` in the component tree. Check `App.js` to verify the provider is present.

### Variant keeps changing

This shouldn't happen with the deterministic hash. Check:
1. Is localStorage being cleared somewhere?
2. Is the userId being regenerated?
3. Are you in incognito mode (localStorage is ephemeral)?

### Events not tracking

1. Check browser console for `[A/B Test Event]` logs (development only)
2. Verify `trackConversion` is being called
3. Check if the component is actually using `useExperiment`

---

## Future Enhancements

- [ ] Server-side variant assignment for SEO-critical experiments
- [ ] Integration with feature flag service (LaunchDarkly, Split.io)
- [ ] Automatic statistical significance calculation
- [ ] Experiment scheduling (start/end dates)
- [ ] Traffic allocation (run experiment on X% of users)
- [ ] Mutual exclusion groups for overlapping experiments
