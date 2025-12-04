import { memo } from 'react';
import { STEP_TITLES } from '../../../context/CheckoutContext';
import { CheckIcon } from '../../../components/Icons';

const StepIndicator = memo(function StepIndicator({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}) {
  return (
    <nav className="checkout-steps" aria-label="Checkout progress">
      <ol className="checkout-steps__list">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step);
          const isCurrent = currentStep === step;
          const isClickable = isCompleted || isCurrent;

          return (
            <li
              key={step}
              className={`checkout-steps__item ${isCurrent ? 'checkout-steps__item--current' : ''} ${isCompleted ? 'checkout-steps__item--completed' : ''}`}
            >
              <button
                type="button"
                className="checkout-steps__button"
                onClick={() => isClickable && onStepClick(step)}
                disabled={!isClickable}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className="checkout-steps__number">
                  {isCompleted ? <CheckIcon /> : index + 1}
                </span>
                <span className="checkout-steps__label">
                  {STEP_TITLES[step]}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`checkout-steps__connector ${isCompleted ? 'checkout-steps__connector--completed' : ''}`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

export default StepIndicator;
