# ModelPreview

A lightweight 3D model preview component optimized for product cards on the home page.

## Overview

Uses a snapshot-based approach: renders the 3D model once, captures an image, then releases the WebGL context. This allows displaying many 3D previews without hitting WebGL context limits.

## Features

- Lazy loading with IntersectionObserver
- Snapshot caching (persists across instances)
- Queue system for sequential rendering
- WebGL fallback handling
- Loading states
- 3D badge indicator
- Gradient background support

## Usage

```jsx
import ModelPreview from './components/ModelPreview';

<ModelPreview
  model={{ url: '/models/robot.glb', scale: 1 }}
  previewColor="linear-gradient(135deg, #4A90E2, #357ABD)"
  alt="Robot 3D Model"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `{ url: string, scale?: number }` | `null` | 3D model configuration |
| `fallbackImage` | `string` | - | Image to show if 3D unavailable |
| `previewColor` | `string` | `'linear-gradient(...)'` | Background gradient |
| `alt` | `string` | `'3D Model Preview'` | Alt text for accessibility |
| `skipCache` | `boolean` | `false` | Skip reading from cache |
| `disableCacheWrite` | `boolean` | `false` | Don't save to cache |

## How It Works

### 1. Lazy Loading
Uses IntersectionObserver to only load models when visible:

```javascript
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      setIsVisible(true);
    }
  },
  { rootMargin: '100px', threshold: 0.1 }
);
```

### 2. Render Queue
Models render one at a time to prevent WebGL context exhaustion:

```javascript
function addToQueue(callback) {
  const id = ++queueIdCounter;
  queueCallbacks.set(id, callback);
  renderQueue.push({ id, callback });
  processQueue();
  return id;
}
```

### 3. Snapshot Capture
After model loads, captures canvas to PNG:

```javascript
const handleSnapshot = (dataUrl) => {
  snapshotCache.set(model.url, dataUrl);
  setSnapshot(dataUrl);
  setIsRendering(false);
  finishQueueItem();
};
```

### 4. Cache Lookup
Checks cache before rendering:

```javascript
const [snapshot, setSnapshot] = useState(() =>
  model && !skipCache ? snapshotCache.get(model.url) : null
);
```

## Component States

1. **Waiting** - In queue, shows fallback with spinner
2. **Rendering** - Canvas active, capturing snapshot
3. **Snapshot** - Displaying cached image
4. **Fallback** - No model/WebGL unavailable

## Render Flow

```
Component mounts
    ↓
Check cache → [cached] → Show snapshot
    ↓ [not cached]
Wait for visibility
    ↓
Add to render queue
    ↓
Wait for turn
    ↓
Create Canvas → Load model → Wait 3 frames
    ↓
Capture snapshot → Cache → Show image
    ↓
Release WebGL context
```

## Sub-Components

### SnapshotCapture
Internal component that captures canvas after model renders:

```jsx
function SnapshotCapture({ onCapture }) {
  const { gl, scene, camera } = useThree();
  // Wait 3 frames then capture
}
```

### SimpleModel
Loads and displays the GLTF model:

```jsx
<SimpleModel
  url={model.url}
  onLoad={handleModelLoad}
  scale={model.scale || 1}
/>
```

## Styling

Located in `ModelPreview.scss`:

```scss
.model-preview { }
.model-preview--fallback { }
.model-preview--snapshot { }
.model-preview--waiting { }
.model-preview--loaded { }
.model-preview__canvas { }
.model-preview__badge { }
.model-preview__loading { }
.model-preview__spinner { }
.model-preview__fallback-bg { }
.model-preview__snapshot-image { }
```

## Preloading

Static method to preload models:

```javascript
ModelPreview.preload({ url: '/models/robot.glb' });
```

## Performance Considerations

- Renders models sequentially (queue system)
- Releases WebGL contexts after snapshot
- Caches snapshots globally
- Uses low-power GPU preference
- Passive event listeners for scroll performance

## Related

- [ModelViewer.md](./ModelViewer.md)
- [ProductCard.md](./ProductCard.md)
- [ProductPage.md](./ProductPage.md)
