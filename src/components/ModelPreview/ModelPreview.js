import React, { Suspense, useState, useCallback, useRef, memo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  useGLTF,
  useAnimations,
  Environment,
  Center,
} from '@react-three/drei';
import './ModelPreview.scss';

/**
 * ModelPreview Component
 *
 * Lightweight 3D model preview for product cards on the home page.
 * Optimized for performance with minimal features.
 *
 * Features:
 * - Auto-rotating 3D model
 * - Lazy loading with IntersectionObserver
 * - Minimal controls for better performance
 * - Hover to pause rotation
 */

// Simple model component with animation support
const SimpleModel = memo(function SimpleModel({ url, onLoad }) {
  const group = useRef();
  const { scene, animations } = useGLTF(url);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
        }
      });
      onLoad?.();
    }
  }, [scene, onLoad]);

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

// Simple loading spinner
function LoadingSpinner() {
  return (
    <div className="model-preview__loading">
      <div className="model-preview__spinner" />
    </div>
  );
}

// Main ModelPreview component
const ModelPreview = memo(function ModelPreview({
  model = null,
  fallbackImage,
  previewColor = 'linear-gradient(135deg, #4A90E2, #357ABD)',
  alt = '3D Model Preview'
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef(null);

  // Lazy load with IntersectionObserver
  useEffect(() => {
    // Fallback for environments without IntersectionObserver (SSR, tests)
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleModelLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
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

  // If no model, WebGL not supported, or error, show fallback
  if (!model || !isWebGLSupported() || hasError) {
    return (
      <div
        ref={containerRef}
        className="model-preview model-preview--fallback"
        style={{ '--preview-color': previewColor }}
      >
        <div className="model-preview__fallback-bg" aria-hidden="true">
          <span className="model-preview__fallback-text">3D</span>
        </div>
        {fallbackImage && (
          <img
            src={fallbackImage}
            alt={alt}
            className="model-preview__fallback-image"
            loading="lazy"
          />
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`model-preview ${isLoaded ? 'model-preview--loaded' : ''}`}
      style={{ '--preview-color': previewColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient */}
      <div className="model-preview__bg" aria-hidden="true" />

      {/* Loading state */}
      {!isLoaded && isVisible && <LoadingSpinner />}

      {/* Canvas - only render when visible */}
      {isVisible && (
        <div className="model-preview__canvas">
          <Canvas
            camera={{ position: [0, 0, 4], fov: 45 }}
            dpr={[1, 1.5]} // Lower DPR for performance
            gl={{
              antialias: false, // Disable for performance
              alpha: true,
              powerPreference: 'low-power'
            }}
            onError={handleError}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />

            <Environment preset="city" />

            <Suspense fallback={null}>
              <SimpleModel
                url={model.url}
                onLoad={handleModelLoad}
              />
            </Suspense>

            <OrbitControls
              autoRotate={!isHovered}
              autoRotateSpeed={3}
              enablePan={false}
              enableZoom={false}
              enableRotate={true}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI - Math.PI / 3}
            />
          </Canvas>
        </div>
      )}

      {/* 3D Badge */}
      {isLoaded && (
        <div className="model-preview__badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          3D
        </div>
      )}
    </div>
  );
});

// Preload helper
ModelPreview.preload = (model) => {
  if (model && model.url) {
    useGLTF.preload(model.url);
  }
};

export default ModelPreview;
