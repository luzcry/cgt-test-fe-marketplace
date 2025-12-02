import { Suspense, useState, useCallback, useRef, memo, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
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
 * Uses a snapshot approach: renders 3D once, captures image, releases context.
 *
 * Features:
 * - Renders 3D model and captures snapshot
 * - Caches snapshots to avoid re-rendering
 * - Hover to show live 3D (optional)
 * - No WebGL context limits since contexts are released after capture
 */

// Global cache for model snapshots (persists across component instances)
const snapshotCache = new Map();

// Queue system for rendering models one at a time
// Uses a Map to track callbacks by ID for cleanup on unmount
let renderQueue = [];
let isProcessingQueue = false;
let queueIdCounter = 0;
const queueCallbacks = new Map();

function processQueue() {
  if (isProcessingQueue || renderQueue.length === 0) return;
  isProcessingQueue = true;

  const { id, callback } = renderQueue.shift();

  // Only execute if callback hasn't been removed (component still mounted)
  if (queueCallbacks.has(id)) {
    callback();
  } else {
    // Skip this item and process next
    isProcessingQueue = false;
    processQueue();
  }
}

function addToQueue(callback) {
  const id = ++queueIdCounter;
  queueCallbacks.set(id, callback);
  renderQueue.push({ id, callback });
  processQueue();
  return id;
}

function removeFromQueue(id) {
  queueCallbacks.delete(id);
  // Also remove from pending queue if not yet processed
  renderQueue = renderQueue.filter(item => item.id !== id);
}

function finishQueueItem() {
  isProcessingQueue = false;
  processQueue();
}

// Component to capture canvas snapshot
function SnapshotCapture({ onCapture }) {
  const { gl, scene, camera } = useThree();
  const capturedRef = useRef(false);
  const frameCountRef = useRef(0);

  useEffect(() => {
    if (capturedRef.current) return;

    let rafId;

    // Wait for a few frames to ensure the model is fully rendered
    // This is more reliable than a fixed timeout as it adapts to actual render cycles
    const waitForRender = () => {
      frameCountRef.current++;

      // Wait for 3 frames to ensure model geometry and textures are loaded
      if (frameCountRef.current < 3) {
        rafId = requestAnimationFrame(waitForRender);
        return;
      }

      if (capturedRef.current) return;
      capturedRef.current = true;

      // Render and capture
      gl.render(scene, camera);
      const dataUrl = gl.domElement.toDataURL('image/png');
      onCapture(dataUrl);
    };

    rafId = requestAnimationFrame(waitForRender);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [gl, scene, camera, onCapture]);

  return null;
}

// Simple model component with animation support
const SimpleModel = memo(function SimpleModel({ url, onLoad, scale = 1 }) {
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
        <primitive object={scene} scale={scale} />
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
  alt = '3D Model Preview',
  skipCache = false,
  disableCacheWrite = false
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [snapshot, setSnapshot] = useState(() =>
    model && !skipCache ? snapshotCache.get(model.url) : null
  );
  const [isRendering, setIsRendering] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef(null);
  const queueIdRef = useRef(null);

  // Check if we already have a cached snapshot
  useEffect(() => {
    if (model && !skipCache && snapshotCache.has(model.url)) {
      setSnapshot(snapshotCache.get(model.url));
    }
  }, [model, skipCache]);

  // Lazy load with IntersectionObserver
  // Note: Observer continues after first intersection (doesn't disconnect early)
  // to support potential future hover-to-show-live-3D feature that would need
  // to know when the element leaves viewport. Cleanup happens on unmount.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Queue rendering when visible and no snapshot exists
  useEffect(() => {
    if (!isVisible || !model || snapshot || queueIdRef.current !== null || hasError) return;

    const id = addToQueue(() => {
      setIsRendering(true);
    });
    queueIdRef.current = id;

    // Cleanup: remove from queue if component unmounts before processing
    return () => {
      if (queueIdRef.current !== null) {
        removeFromQueue(queueIdRef.current);
        queueIdRef.current = null;
      }
    };
  }, [isVisible, model, snapshot, hasError]);

  const handleModelLoad = useCallback(() => {
    setModelLoaded(true);
  }, []);

  const handleSnapshot = useCallback((dataUrl) => {
    if (model && !skipCache && !disableCacheWrite) {
      snapshotCache.set(model.url, dataUrl);
    }
    setSnapshot(dataUrl);
    setIsRendering(false);
    setModelLoaded(false);

    // Clean up queue tracking before signaling next item can process
    if (queueIdRef.current !== null) {
      removeFromQueue(queueIdRef.current);
      queueIdRef.current = null;
    }
    finishQueueItem();
  }, [model, skipCache, disableCacheWrite]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsRendering(false);

    // Clean up queue tracking before signaling next item can process
    if (queueIdRef.current !== null) {
      removeFromQueue(queueIdRef.current);
      queueIdRef.current = null;
    }
    finishQueueItem();
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

  // Show cached snapshot
  if (snapshot) {
    return (
      <div
        ref={containerRef}
        className="model-preview model-preview--snapshot"
        style={{ '--preview-color': previewColor }}
      >
        <img
          src={snapshot}
          alt={alt}
          className="model-preview__snapshot-image"
        />
        {/* 3D Badge */}
        <div className="model-preview__badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          3D
        </div>
      </div>
    );
  }

  // Show loading state while waiting in queue or rendering
  if (!isRendering) {
    return (
      <div
        ref={containerRef}
        className="model-preview model-preview--waiting"
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
        <LoadingSpinner />
      </div>
    );
  }

  // Render 3D and capture snapshot
  return (
    <div
      ref={containerRef}
      className={`model-preview ${modelLoaded ? 'model-preview--loaded' : ''}`}
      style={{ '--preview-color': previewColor }}
    >
      {/* Background gradient */}
      <div className="model-preview__bg" aria-hidden="true" />

      {/* Loading state */}
      {!modelLoaded && <LoadingSpinner />}

      {/* Canvas for rendering */}
      <div className="model-preview__canvas">
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true, // Required for snapshot
            powerPreference: 'low-power'
          }}
          onError={handleError}
          // Use passive event listeners for better scroll performance
          events={(store) => ({
            ...store,
            passive: true
          })}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />

          <Environment preset="city" />

          <Suspense fallback={null}>
            <SimpleModel
              url={model.url}
              onLoad={handleModelLoad}
              scale={model.scale || 1}
            />
          </Suspense>

          <OrbitControls
            autoRotate={false}
            enablePan={false}
            enableZoom={false}
            enableRotate={false}
          />

          {/* Capture snapshot after model loads */}
          {modelLoaded && <SnapshotCapture onCapture={handleSnapshot} />}
        </Canvas>
      </div>

      {/* 3D Badge */}
      <div className="model-preview__badge" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        3D
      </div>
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
