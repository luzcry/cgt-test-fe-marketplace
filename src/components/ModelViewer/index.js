/**
 * ModelViewer Lazy Loader
 *
 * This wrapper ensures Three.js and all 3D dependencies are only loaded
 * when the ModelViewer is actually rendered, not when this module is imported.
 * This significantly reduces the initial bundle size for pages that don't need 3D.
 */

import { lazy, Suspense, memo } from 'react';

// Lazy load the actual ModelViewer component with Three.js
const ModelViewerImpl = lazy(() =>
  import(/* webpackChunkName: "three-viewer" */ './ModelViewer')
);

// Loading placeholder that matches the viewer dimensions
function LoadingPlaceholder({ previewColor = 'linear-gradient(135deg, #4A90E2, #357ABD)' }) {
  return (
    <div
      className="model-viewer model-viewer--loading"
      style={{
        '--preview-color': previewColor,
        background: 'var(--preview-color)',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          color: 'white',
        }}
      >
        <div
          className="model-viewer__loader-spinner"
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255,255,255,0.3)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
          aria-hidden="true"
        />
        <span>Loading 3D Viewer...</span>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Wrapper component that handles lazy loading
const ModelViewer = memo(function ModelViewer(props) {
  return (
    <Suspense fallback={<LoadingPlaceholder previewColor={props.previewColor} />}>
      <ModelViewerImpl {...props} />
    </Suspense>
  );
});

// Re-export preload helper
ModelViewer.preload = (model) => {
  // Trigger the lazy load of the ModelViewer module first
  import(/* webpackChunkName: "three-viewer" */ './ModelViewer').then((module) => {
    if (module.default.preload) {
      module.default.preload(model);
    }
  });
};

export default ModelViewer;
