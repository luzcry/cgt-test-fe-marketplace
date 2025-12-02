import React, { Suspense, useState, useCallback, useRef, memo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  useGLTF,
  useAnimations,
  Environment,
  ContactShadows,
  Center,
  Html,
  useProgress
} from '@react-three/drei';
import './ModelViewer.scss';

/**
 * ModelViewer Component
 *
 * Interactive 3D model viewer built with Three.js (react-three-fiber)
 * Now supports multiple models per product with model selector
 *
 * Features:
 * - Multiple model support with thumbnail selector
 * - Animation playback for animated models
 * - Orbit controls (rotate, zoom, pan)
 * - Wireframe toggle
 * - Fullscreen mode
 * - Loading states with progress
 * - WebGL fallback handling
 */

// Loading indicator component inside Canvas
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="model-viewer__loader" role="status" aria-live="polite">
        <div className="model-viewer__loader-spinner" aria-hidden="true" />
        <span className="model-viewer__loader-text">
          Loading 3D Model... {progress.toFixed(0)}%
        </span>
      </div>
    </Html>
  );
}

// Animated model component with animation support
const AnimatedModel = memo(function AnimatedModel({ url, wireframe, onLoad }) {
  const group = useRef();
  const { scene, animations } = useGLTF(url);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (scene) {
      // Apply wireframe to all meshes
      scene.traverse((child) => {
        if (child.isMesh) {
          child.material.wireframe = wireframe;
          // Enable shadows
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      onLoad?.();
    }
  }, [scene, wireframe, onLoad]);

  // Play first animation if available
  useEffect(() => {
    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]].reset().fadeIn(0.5).play();
      return () => actions[names[0]]?.fadeOut(0.5);
    }
  }, [actions, names]);

  return (
    <group ref={group}>
      <Center>
        <primitive object={scene} scale={1} />
      </Center>
    </group>
  );
});

// Error Fallback component
function ErrorFallback({ error, onRetry }) {
  return (
    <div className="model-viewer__error" role="alert">
      <div className="model-viewer__error-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <p className="model-viewer__error-title">Unable to load 3D model</p>
      <p className="model-viewer__error-message">
        {error?.message || 'WebGL may not be supported in your browser'}
      </p>
      {onRetry && (
        <button
          type="button"
          className="model-viewer__error-btn"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

// Control Button component
const ControlButton = memo(function ControlButton({
  icon,
  label,
  active,
  onClick,
  ariaPressed
}) {
  return (
    <button
      type="button"
      className={`model-viewer__control ${active ? 'model-viewer__control--active' : ''}`}
      onClick={onClick}
      aria-label={label}
      aria-pressed={ariaPressed}
      title={label}
    >
      {icon}
    </button>
  );
});

// Main ModelViewer component
const ModelViewer = memo(function ModelViewer({
  model = null, // Single { name, url } object
  productName = '3D Model',
  fallbackImage,
  previewColor = 'linear-gradient(135deg, #4A90E2, #357ABD)'
}) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);

  // Toggle auto-rotation
  const toggleAutoRotate = useCallback(() => {
    setAutoRotate(prev => !prev);
  }, []);

  // Toggle wireframe mode
  const toggleWireframe = useCallback(() => {
    setWireframe(prev => !prev);
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn('Fullscreen not supported:', err);
    }
  }, []);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle model load
  const handleModelLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Handle WebGL errors
  const handleError = useCallback((error) => {
    console.error('ModelViewer error:', error);
    setHasError(true);
  }, []);

  // Retry loading
  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoaded(false);
  }, []);

  // Check WebGL support
  const isWebGLSupported = useCallback(() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }, []);

  // If no model or WebGL not supported, show fallback
  if (!model || !isWebGLSupported()) {
    return (
      <div
        className="model-viewer model-viewer--fallback"
        style={{ '--preview-color': previewColor }}
      >
        <div className="model-viewer__fallback-bg" aria-hidden="true">
          <span className="model-viewer__fallback-text">3D</span>
        </div>
        {fallbackImage && (
          <img
            src={fallbackImage}
            alt={`${productName} preview`}
            className="model-viewer__fallback-image"
            loading="lazy"
          />
        )}
        {!isWebGLSupported() && (
          <p className="model-viewer__fallback-notice">
            3D preview requires WebGL support
          </p>
        )}
      </div>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div className="model-viewer model-viewer--error">
        <ErrorFallback onRetry={handleRetry} />
      </div>
    );
  }

  // Icons for controls
  const icons = {
    rotate: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
      </svg>
    ),
    wireframe: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    fullscreen: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {isFullscreen ? (
          <>
            <path d="M8 3v3a2 2 0 0 1-2 2H3" />
            <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
            <path d="M3 16h3a2 2 0 0 1 2 2v3" />
            <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
          </>
        ) : (
          <>
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          </>
        )}
      </svg>
    ),
  };

  return (
    <div
      ref={containerRef}
      className={`model-viewer ${isFullscreen ? 'model-viewer--fullscreen' : ''}`}
      role="img"
      aria-label={`Interactive 3D model of ${productName}. Use mouse to rotate and zoom.`}
    >
      {/* Canvas Container */}
      <div className="model-viewer__canvas">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true
          }}
          onError={handleError}
        >
          {/* Lighting Setup */}
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow={false}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {/* Environment for reflections */}
          <Environment preset="city" />

          {/* Model with Suspense */}
          <Suspense fallback={<Loader />}>
            {model && (
              <AnimatedModel
                key={model.url}
                url={model.url}
                wireframe={wireframe}
                onLoad={handleModelLoad}
              />
            )}
            <ContactShadows
              position={[0, -1.5, 0]}
              opacity={0.4}
              scale={10}
              blur={2}
              far={4}
            />
          </Suspense>

          {/* Orbit Controls */}
          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={2}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
          />
        </Canvas>
      </div>

      {/* Controls Overlay */}
      <div
        className="model-viewer__controls"
        role="toolbar"
        aria-label="3D viewer controls"
      >
        <ControlButton
          icon={icons.rotate}
          label={autoRotate ? 'Pause rotation' : 'Start rotation'}
          active={autoRotate}
          onClick={toggleAutoRotate}
          ariaPressed={autoRotate}
        />
        <ControlButton
          icon={icons.wireframe}
          label={wireframe ? 'Show textured' : 'Show wireframe'}
          active={wireframe}
          onClick={toggleWireframe}
          ariaPressed={wireframe}
        />
        <ControlButton
          icon={icons.fullscreen}
          label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          active={isFullscreen}
          onClick={toggleFullscreen}
          ariaPressed={isFullscreen}
        />
      </div>

      {/* Current Model Name */}
      {model && isLoaded && (
        <div className="model-viewer__model-name" aria-live="polite">
          {model.name}
        </div>
      )}

      {/* Interaction Hint */}
      {isLoaded && !isFullscreen && (
        <p className="model-viewer__hint" aria-hidden="true">
          <span className="model-viewer__hint-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </span>
          Drag to rotate • Scroll to zoom
        </p>
      )}

      {/* Screen reader description */}
      <div className="visually-hidden" aria-live="polite">
        {isLoaded && `3D model ${model?.name} loaded. Use mouse or touch to interact.`}
      </div>
    </div>
  );
});

// Preload helper for performance
ModelViewer.preload = (model) => {
  if (model && model.url) {
    useGLTF.preload(model.url);
  }
};

export default ModelViewer;
