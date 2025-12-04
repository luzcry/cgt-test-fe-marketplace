import { memo } from 'react';

/**
 * Shared Icon Components
 *
 * Reusable SVG icons used across the application.
 * All icons are memoized to prevent unnecessary re-renders.
 *
 * Benefits:
 * - Single source of truth for icon definitions
 * - Smaller bundle size (no duplication)
 * - Consistent styling and accessibility
 */

export const CartIcon = memo(function CartIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
});

export const PlusIcon = memo(function PlusIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
});

export const StarIcon = memo(function StarIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
});

export const LayersIcon = memo(function LayersIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
});

export const ChevronIcon = memo(function ChevronIcon({
  className = '',
  direction = 'down',
}) {
  const rotation = {
    up: 'rotate(180deg)',
    down: 'rotate(0deg)',
    left: 'rotate(90deg)',
    right: 'rotate(-90deg)',
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      style={{ transform: rotation[direction] }}
    >
      <polyline points="6,9 12,15 18,9" />
    </svg>
  );
});

export const CloseIcon = memo(function CloseIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
});

export const CheckIcon = memo(function CheckIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden="true"
    >
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
});

export const AlertIcon = memo(function AlertIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
});

export const FilterIcon = memo(function FilterIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
});

export const SearchIcon = memo(function SearchIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
});

export const SearchEmptyIcon = memo(function SearchEmptyIcon({
  className = '',
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
});

export const LockIcon = memo(function LockIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
});

export const ArrowRightIcon = memo(function ArrowRightIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
});

export const ArrowLeftIcon = memo(function ArrowLeftIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
});

export const ArrowLongRightIcon = memo(function ArrowLongRightIcon({
  className = '',
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
});

export const BackArrowIcon = memo(function BackArrowIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
});

export const EmailIcon = memo(function EmailIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
});

export const CalendarIcon = memo(function CalendarIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
});

export const PrintIcon = memo(function PrintIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
});

export const CopyIcon = memo(function CopyIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
});

export const TrashIcon = memo(function TrashIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
});

export const TagIcon = memo(function TagIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
});

export const CreditCardIcon = memo(function CreditCardIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
});

export const EmptyCartIcon = memo(function EmptyCartIcon({
  className = '',
  ...props
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
});

export const LogoIcon = memo(function LogoIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
    </svg>
  );
});

export const MinusIcon = memo(function MinusIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
});

// Payment Card Brand Icons
export const VisaIcon = memo(function VisaIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 32"
      fill="none"
      aria-label="Visa"
    >
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <path
        d="M20.5 21h-2.2l1.4-8.5h2.2L20.5 21zm11.1-8.3c-.4-.2-1.1-.4-2-.4-2.2 0-3.7 1.2-3.7 2.8 0 1.2 1.1 1.9 2 2.3.9.4 1.2.7 1.2 1.1 0 .6-.7.9-1.4.9-.9 0-1.4-.1-2.2-.5l-.3-.1-.3 2c.5.2 1.5.5 2.5.5 2.3 0 3.9-1.2 3.9-2.9 0-1-.6-1.7-1.8-2.3-.8-.4-1.2-.7-1.2-1.1 0-.4.4-.8 1.2-.8.7 0 1.2.1 1.6.3l.2.1.3-1.9zm5.7-.2h-1.7c-.5 0-.9.2-1.1.7l-3.2 7.8h2.3l.5-1.3h2.8l.3 1.3h2l-1.9-8.5zm-2.7 5.5l.9-2.4.5 2.4h-1.4zM17 12.5l-2.1 5.8-.2-1.2-.8-4c-.1-.5-.5-.6-1-.6H9.2l-.1.3c.8.2 1.5.5 2 .8l1.9 7.3h2.3l3.5-8.4H17z"
        fill="white"
      />
    </svg>
  );
});

export const MastercardIcon = memo(function MastercardIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 32"
      fill="none"
      aria-label="Mastercard"
    >
      <rect width="48" height="32" rx="4" fill="#000" />
      <circle cx="18" cy="16" r="10" fill="#EB001B" />
      <circle cx="30" cy="16" r="10" fill="#F79E1B" />
      <path
        d="M24 8.5a9.96 9.96 0 0 0-6 7.5 9.96 9.96 0 0 0 6 7.5 9.96 9.96 0 0 0 6-7.5 9.96 9.96 0 0 0-6-7.5z"
        fill="#FF5F00"
      />
    </svg>
  );
});

export const AmexIcon = memo(function AmexIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 32"
      fill="none"
      aria-label="American Express"
    >
      <rect width="48" height="32" rx="4" fill="#006FCF" />
      <path
        d="M13.2 20h1.7l-.8-2-.9 2zm18.9-5.6v1h3.1v1.2h-3.1v1.1h3.5l1.6-1.7-1.5-1.6h-3.6zm-21-1.9h-3l-2.7 6.5h1.9l.5-1.2h2.8l.5 1.2h2l-2-6.5zm15.5 0h-2.3l-1.4 4.4-1.5-4.4h-2.3l2.5 6.5h2.3l2.7-6.5zm8 0h-5.5v6.5h5.5l2.1-2.2v-2.1l-2.1-2.2zm2.9 0l2.7 3.3-2.7 3.2h2.4l1.6-2 1.6 2H45l-2.7-3.2 2.7-3.3h-2.4l-1.5 1.9-1.5-1.9h-2.1z"
        fill="white"
      />
    </svg>
  );
});

export const DiscoverIcon = memo(function DiscoverIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 32"
      fill="none"
      aria-label="Discover"
    >
      <rect width="48" height="32" rx="4" fill="#F9F9F9" />
      <path d="M0 16h28a12 12 0 0 0 20 0v16H0V16z" fill="#F76F00" />
      <ellipse cx="28" cy="16" rx="7" ry="7" fill="#F76F00" />
      <path
        d="M9.2 19.5h-2v-7h2c1.7 0 3 1.3 3 3.5s-1.3 3.5-3 3.5zm-.2-5.7h-.6v4.4h.6c1 0 1.7-.9 1.7-2.2s-.7-2.2-1.7-2.2zm5.8 5.7h-1.3v-7h1.3v7zm4.5-5.2c-.6 0-1 .3-1 .7 0 1.4 2.8.7 2.8 3 0 1.1-.9 1.7-2.1 1.7-.7 0-1.4-.2-1.9-.5l.4-1.1c.4.3.9.4 1.4.4.5 0 .9-.2.9-.6 0-1.4-2.8-.7-2.8-3 0-1 .8-1.7 2-1.7.6 0 1.2.1 1.7.4l-.4 1c-.4-.2-.8-.3-1-.3z"
        fill="#000"
      />
    </svg>
  );
});
