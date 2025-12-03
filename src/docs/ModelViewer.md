# ModelViewer

An interactive 3D model viewer component for product detail pages.

## Overview

Full-featured 3D viewer built with Three.js (react-three-fiber) that allows users to interact with 3D models through rotation, zoom, and various view modes.

## Features

- Interactive orbit controls (rotate, zoom, pan)
- Auto-rotation toggle
- Wireframe mode toggle
- Fullscreen mode
- Animation playback for animated models
- Loading progress indicator
- Error handling with retry
- WebGL fallback
- Responsive design

## Usage

```jsx
import ModelViewer from './components/ModelViewer';

<ModelViewer
  model={{ name: 'Robot', url: '/models/robot.glb', scale: 1 }}
  productName="Cyber Robot"
  previewColor="linear-gradient(135deg, #4A90E2, #357ABD)"
  fallbackImage="/images/robot.jpg"
/>;
```

## Props

| Prop            | Type                                            | Default                  | Description                     |
| --------------- | ----------------------------------------------- | ------------------------ | ------------------------------- |
| `model`         | `{ name: string, url: string, scale?: number }` | `null`                   | 3D model configuration          |
| `productName`   | `string`                                        | `'3D Model'`             | Product name for accessibility  |
| `fallbackImage` | `string`                                        | -                        | Image to show if 3D unavailable |
| `previewColor`  | `string`                                        | `'linear-gradient(...)'` | Background gradient             |

## Controls

### Viewer Controls

- **Auto-Rotate**: Toggle automatic rotation
- **Wireframe**: Toggle wireframe view mode
- **Fullscreen**: Enter/exit fullscreen mode

### Mouse/Touch Controls

- **Drag**: Rotate model
- **Scroll/Pinch**: Zoom in/out
- **Right-drag/Two-finger**: Pan view

## Component Structure

```
ModelViewer
├── Canvas (react-three-fiber)
│   ├── Lighting (ambient, spot, point)
│   ├── Environment (reflections)
│   ├── AnimatedModel
│   ├── ContactShadows
│   └── OrbitControls
├── Controls Toolbar
├── Model Name Display
└── Interaction Hint
```

## Sub-Components

### AnimatedModel

Loads GLTF model with animation support:

```jsx
const AnimatedModel = memo(function AnimatedModel({
  url,
  wireframe,
  onLoad,
  scale = 1,
}) {
  const { scene, animations } = useGLTF(url);
  const { actions, names } = useAnimations(animations, group);
  // ...
});
```

### Loader

Shows loading progress:

```jsx
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div>Loading 3D Model... {progress.toFixed(0)}%</div>
    </Html>
  );
}
```

### ErrorFallback

Displays error state with retry option:

```jsx
<ErrorFallback error={error} onRetry={handleRetry} />
```

### ControlButton

Toolbar button component:

```jsx
<ControlButton
  icon={<RotateIcon />}
  label="Toggle rotation"
  active={autoRotate}
  onClick={toggleAutoRotate}
  ariaPressed={autoRotate}
/>
```

## State Management

```javascript
const [autoRotate, setAutoRotate] = useState(true);
const [wireframe, setWireframe] = useState(false);
const [isFullscreen, setIsFullscreen] = useState(false);
const [hasError, setHasError] = useState(false);
const [isLoaded, setIsLoaded] = useState(false);
```

## Canvas Configuration

```jsx
<Canvas
  camera={{ position: [0, 0, 5], fov: 45 }}
  dpr={[1, 2]}
  gl={{
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance',
  }}
/>
```

## OrbitControls Configuration

```jsx
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
```

## Accessibility

- `role="img"` on container
- Descriptive aria-label
- Toolbar with `role="toolbar"`
- Control buttons with aria-pressed
- Screen reader live region for load state
- Keyboard accessible controls
- `.visually-hidden` class for SR-only content

## Styling

Located in `ModelViewer.scss`:

```scss
.model-viewer {
}
.model-viewer--fullscreen {
}
.model-viewer--fallback {
}
.model-viewer__canvas {
}
.model-viewer__controls {
}
.model-viewer__control {
}
.model-viewer__control--active {
}
.model-viewer__loader {
}
.model-viewer__error {
}
.model-viewer__model-name {
}
.model-viewer__hint {
}
```

## Preloading

Static method to preload models:

```javascript
ModelViewer.preload({ url: '/models/robot.glb' });
```

## WebGL Detection

```javascript
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
```

## Related

- [ModelPreview.md](./ModelPreview.md)
- [ProductPage.md](./ProductPage.md)
