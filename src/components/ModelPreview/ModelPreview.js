import {
  Suspense,
  useState,
  useCallback,
  useRef,
  memo,
  useEffect,
  useMemo,
} from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  useGLTF,
  useAnimations,
  Environment,
  Center,
} from '@react-three/drei';
import './ModelPreview.scss';

class LRUCache {
  constructor(maxSize = 50) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }

  has(key) {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
  }

  get size() {
    return this.cache.size;
  }
}

const snapshotCache = new LRUCache(50);

let renderQueue = [];
let isProcessingQueue = false;
let queueIdCounter = 0;
const queueCallbacks = new Map();

function processQueue() {
  if (isProcessingQueue || renderQueue.length === 0) return;
  isProcessingQueue = true;

  const { id, callback } = renderQueue.shift();

  if (queueCallbacks.has(id)) {
    callback();
  } else {
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
  renderQueue = renderQueue.filter((item) => item.id !== id);
}

function finishQueueItem() {
  isProcessingQueue = false;
  processQueue();
}

function SnapshotCapture({ onCapture }) {
  const { gl, scene, camera } = useThree();
  const capturedRef = useRef(false);
  const frameCountRef = useRef(0);

  useEffect(() => {
    if (capturedRef.current) return;

    let rafId;

    const waitForRender = () => {
      frameCountRef.current++;

      if (frameCountRef.current < 3) {
        rafId = requestAnimationFrame(waitForRender);
        return;
      }

      if (capturedRef.current) return;
      capturedRef.current = true;

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

function LoadingSpinner() {
  return (
    <div className="model-preview__loading">
      <div className="model-preview__spinner" />
    </div>
  );
}

const ModelPreview = memo(function ModelPreview({
  model = null,
  fallbackImage,
  previewColor = 'linear-gradient(135deg, #4A90E2, #357ABD)',
  alt = '3D Model Preview',
  skipCache = false,
  disableCacheWrite = false,
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

  useEffect(() => {
    if (model && !skipCache && snapshotCache.has(model.url)) {
      setSnapshot(snapshotCache.get(model.url));
    }
  }, [model, skipCache]);

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

  useEffect(() => {
    if (
      !isVisible ||
      !model ||
      snapshot ||
      queueIdRef.current !== null ||
      hasError
    )
      return;

    const id = addToQueue(() => {
      setIsRendering(true);
    });
    queueIdRef.current = id;

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

  const handleSnapshot = useCallback(
    (dataUrl) => {
      if (model && !skipCache && !disableCacheWrite) {
        snapshotCache.set(model.url, dataUrl);
      }
      setSnapshot(dataUrl);
      setIsRendering(false);
      setModelLoaded(false);

      if (queueIdRef.current !== null) {
        removeFromQueue(queueIdRef.current);
        queueIdRef.current = null;
      }
      finishQueueItem();
    },
    [model, skipCache, disableCacheWrite]
  );

  const handleError = useCallback(() => {
    setHasError(true);
    setIsRendering(false);

    if (queueIdRef.current !== null) {
      removeFromQueue(queueIdRef.current);
      queueIdRef.current = null;
    }
    finishQueueItem();
  }, []);

  const isWebGLSupported = useMemo(() => {
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

  if (!model || !isWebGLSupported || hasError) {
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
        <div className="model-preview__badge" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          3D
        </div>
      </div>
    );
  }

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

  return (
    <div
      ref={containerRef}
      className={`model-preview ${modelLoaded ? 'model-preview--loaded' : ''}`}
      style={{ '--preview-color': previewColor }}
    >
      <div className="model-preview__bg" aria-hidden="true" />

      {!modelLoaded && <LoadingSpinner />}

      <div className="model-preview__canvas">
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
            powerPreference: 'low-power',
          }}
          onError={handleError}
          events={(store) => ({
            ...store,
            passive: true,
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

          {modelLoaded && <SnapshotCapture onCapture={handleSnapshot} />}
        </Canvas>
      </div>

      <div className="model-preview__badge" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        3D
      </div>
    </div>
  );
});

ModelPreview.preload = (model) => {
  if (model && model.url) {
    useGLTF.preload(model.url);
  }
};

export default ModelPreview;
