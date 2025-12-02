import React from 'react';

/**
 * Mock ModelViewer component for testing
 * Three.js requires WebGL which isn't available in Jest/jsdom environment
 */
const MockModelViewer = ({ modelUrl, productName, fallbackImage, previewColor }) => (
  <div
    data-testid="model-viewer"
    className="model-viewer model-viewer--mock"
    role="img"
    aria-label={`Interactive 3D model of ${productName}`}
    style={{ '--preview-color': previewColor }}
  >
    {fallbackImage && (
      <img
        src={fallbackImage}
        alt={`${productName} preview`}
        className="model-viewer__fallback-image"
      />
    )}
    {modelUrl && <span data-testid="model-url">{modelUrl}</span>}
  </div>
);

export default MockModelViewer;
