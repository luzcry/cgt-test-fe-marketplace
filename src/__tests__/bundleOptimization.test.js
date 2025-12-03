/**
 * Bundle Optimization Tests
 *
 * These tests verify that the webpack/CRACO configuration
 * produces optimized bundle output with proper code splitting.
 *
 * Note: These tests require a production build to exist.
 * Run `npm run build` before running these tests.
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '../../build');
const STATIC_JS_DIR = path.join(BUILD_DIR, 'static/js');
const STATIC_CSS_DIR = path.join(BUILD_DIR, 'static/css');

// Skip tests if build directory doesn't exist
const buildExists = fs.existsSync(BUILD_DIR);

const describeIfBuildExists = buildExists ? describe : describe.skip;

describeIfBuildExists('Bundle Optimization', () => {
  let jsFiles = [];
  let cssFiles = [];
  let gzFiles = [];

  beforeAll(() => {
    // This block only runs if build exists (describeIfBuildExists)
    jsFiles = fs.readdirSync(STATIC_JS_DIR).filter((f) => f.endsWith('.js'));
    cssFiles = fs.readdirSync(STATIC_CSS_DIR).filter((f) => f.endsWith('.css'));
    gzFiles = fs.readdirSync(STATIC_JS_DIR).filter((f) => f.endsWith('.js.gz'));
  });

  describe('Chunk Splitting', () => {
    it('should create separate vendor chunks for Three.js', () => {
      const threeVendorChunk = jsFiles.find((f) => f.includes('three-vendor'));
      expect(threeVendorChunk).toBeDefined();
    });

    it('should create separate vendor chunks for React', () => {
      const reactVendorChunk = jsFiles.find((f) => f.includes('react-vendor'));
      expect(reactVendorChunk).toBeDefined();
    });

    it('should create a general vendors chunk', () => {
      const vendorsChunk = jsFiles.find(
        (f) => f.startsWith('vendors.') && f.endsWith('.js')
      );
      expect(vendorsChunk).toBeDefined();
    });

    it('should create a separate checkout chunk', () => {
      const checkoutChunk = jsFiles.find((f) => f.includes('checkout'));
      expect(checkoutChunk).toBeDefined();
    });

    it('should create a separate three-viewer chunk', () => {
      const threeViewerChunk = jsFiles.find((f) => f.includes('three-viewer'));
      expect(threeViewerChunk).toBeDefined();
    });

    it('should create a main bundle', () => {
      const mainBundle = jsFiles.find((f) => f.startsWith('main.'));
      expect(mainBundle).toBeDefined();
    });
  });

  describe('Gzip Compression', () => {
    it('should create gzip compressed JS files', () => {
      expect(gzFiles.length).toBeGreaterThan(0);
    });

    it('should compress all major JS chunks', () => {
      const mainGz = gzFiles.find((f) => f.startsWith('main.'));
      const vendorsGz = gzFiles.find((f) => f.startsWith('vendors.'));
      const reactVendorGz = gzFiles.find((f) => f.includes('react-vendor'));
      const threeVendorGz = gzFiles.find((f) => f.includes('three-vendor'));

      expect(mainGz).toBeDefined();
      expect(vendorsGz).toBeDefined();
      expect(reactVendorGz).toBeDefined();
      expect(threeVendorGz).toBeDefined();
    });

    it('should create gzip files smaller than originals', () => {
      const mainJs = jsFiles.find((f) => f.startsWith('main.'));
      const mainGz = gzFiles.find((f) => f.startsWith('main.'));

      // First assert the files exist
      expect(mainJs).toBeDefined();
      expect(mainGz).toBeDefined();

      const jsSize = fs.statSync(path.join(STATIC_JS_DIR, mainJs)).size;
      const gzSize = fs.statSync(path.join(STATIC_JS_DIR, mainGz)).size;

      expect(gzSize).toBeLessThan(jsSize);
    });
  });

  describe('Bundle Size Limits', () => {
    it('should keep main bundle under 50KB (uncompressed)', () => {
      const mainBundle = jsFiles.find((f) => f.startsWith('main.'));
      expect(mainBundle).toBeDefined();

      const stats = fs.statSync(path.join(STATIC_JS_DIR, mainBundle));
      const sizeInKB = stats.size / 1024;

      // Main bundle should be small since vendors are split out
      expect(sizeInKB).toBeLessThan(50);
    });

    it('should keep Three.js vendor chunk isolated (> 200KB uncompressed)', () => {
      const threeVendor = jsFiles.find((f) => f.includes('three-vendor'));
      expect(threeVendor).toBeDefined();

      const stats = fs.statSync(path.join(STATIC_JS_DIR, threeVendor));
      const sizeInKB = stats.size / 1024;

      // Three.js is large - this confirms it's properly isolated
      expect(sizeInKB).toBeGreaterThan(200);
    });

    it('should have reasonable total initial bundle size', () => {
      // Initial bundles (loaded on every page): main + react-vendor + vendors
      const mainBundle = jsFiles.find((f) => f.startsWith('main.'));
      const reactVendor = jsFiles.find((f) => f.includes('react-vendor'));
      const vendors = jsFiles.find(
        (f) => f.startsWith('vendors.') && f.endsWith('.js')
      );

      // Assert all required chunks exist
      expect(mainBundle).toBeDefined();
      expect(reactVendor).toBeDefined();
      expect(vendors).toBeDefined();

      const totalSize =
        fs.statSync(path.join(STATIC_JS_DIR, mainBundle)).size +
        fs.statSync(path.join(STATIC_JS_DIR, reactVendor)).size +
        fs.statSync(path.join(STATIC_JS_DIR, vendors)).size;

      const totalSizeKB = totalSize / 1024;

      // Initial load (without Three.js) should be under 500KB uncompressed
      expect(totalSizeKB).toBeLessThan(500);
    });
  });

  describe('CSS Optimization', () => {
    it('should create CSS chunks', () => {
      expect(cssFiles.length).toBeGreaterThan(0);
    });

    it('should have a main CSS file', () => {
      const mainCss = cssFiles.find((f) => f.startsWith('main.'));
      expect(mainCss).toBeDefined();
    });

    it('should have separate checkout CSS chunk', () => {
      const checkoutCss = cssFiles.find((f) => f.includes('checkout'));
      expect(checkoutCss).toBeDefined();
    });
  });

  describe('Asset Manifest', () => {
    it('should generate asset-manifest.json', () => {
      const manifestPath = path.join(BUILD_DIR, 'asset-manifest.json');
      expect(fs.existsSync(manifestPath)).toBe(true);
    });

    it('should include all chunk references in manifest', () => {
      const manifestPath = path.join(BUILD_DIR, 'asset-manifest.json');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

      expect(manifest.files).toBeDefined();
      expect(manifest.files['main.js']).toBeDefined();
      expect(manifest.files['main.css']).toBeDefined();
    });
  });
});

describeIfBuildExists('CRACO Configuration', () => {
  it('should have craco.config.js file', () => {
    const cracoPath = path.join(__dirname, '../../craco.config.js');
    expect(fs.existsSync(cracoPath)).toBe(true);
  });

  it('should export valid configuration', () => {
    const cracoConfig = require('../../craco.config.js');

    expect(cracoConfig).toBeDefined();
    expect(cracoConfig.webpack).toBeDefined();
    expect(cracoConfig.webpack.plugins).toBeDefined();
    expect(cracoConfig.webpack.configure).toBeDefined();
  });
});

// Unit tests that don't require build
describe('CRACO Config Structure', () => {
  let cracoConfig;

  beforeAll(() => {
    cracoConfig = require('../../craco.config.js');
  });

  it('should configure compression plugin', () => {
    const plugins = cracoConfig.webpack.plugins.add;
    const compressionPlugin = plugins.find(
      (p) => p.constructor.name === 'CompressionPlugin'
    );

    expect(compressionPlugin).toBeDefined();
  });

  it('should configure webpack with custom settings', () => {
    expect(typeof cracoConfig.webpack.configure).toBe('function');
  });

  it('should apply production optimizations', () => {
    // Mock webpack config
    const mockConfig = {
      optimization: {},
      plugins: [],
    };

    const result = cracoConfig.webpack.configure(mockConfig, {
      env: 'production',
    });

    expect(result.optimization.usedExports).toBe(true);
    expect(result.optimization.sideEffects).toBe(true);
    expect(result.optimization.splitChunks).toBeDefined();
  });

  it('should configure Three.js chunk splitting', () => {
    const mockConfig = {
      optimization: {},
      plugins: [],
    };

    const result = cracoConfig.webpack.configure(mockConfig, {
      env: 'production',
    });

    const threeCache = result.optimization.splitChunks.cacheGroups.three;
    expect(threeCache).toBeDefined();
    expect(threeCache.name).toBe('three-vendor');
    expect(threeCache.priority).toBe(30);
  });

  it('should configure React chunk splitting', () => {
    const mockConfig = {
      optimization: {},
      plugins: [],
    };

    const result = cracoConfig.webpack.configure(mockConfig, {
      env: 'production',
    });

    const reactCache = result.optimization.splitChunks.cacheGroups.react;
    expect(reactCache).toBeDefined();
    expect(reactCache.name).toBe('react-vendor');
    expect(reactCache.priority).toBe(20);
  });

  it('should add bundle analyzer in analyze mode', () => {
    const originalEnv = process.env.ANALYZE;
    process.env.ANALYZE = 'true';

    // Re-require to get fresh config
    jest.resetModules();
    const freshConfig = require('../../craco.config.js');

    const mockConfig = {
      optimization: {},
      plugins: [],
    };

    const result = freshConfig.webpack.configure(mockConfig, {
      env: 'production',
    });

    const analyzerPlugin = result.plugins.find(
      (p) => p.constructor.name === 'BundleAnalyzerPlugin'
    );

    expect(analyzerPlugin).toBeDefined();

    // Restore env
    process.env.ANALYZE = originalEnv;
  });

  it('should not add bundle analyzer in normal mode', () => {
    const originalEnv = process.env.ANALYZE;
    delete process.env.ANALYZE;

    jest.resetModules();
    const freshConfig = require('../../craco.config.js');

    const mockConfig = {
      optimization: {},
      plugins: [],
    };

    const result = freshConfig.webpack.configure(mockConfig, {
      env: 'production',
    });

    const analyzerPlugin = result.plugins.find(
      (p) => p.constructor.name === 'BundleAnalyzerPlugin'
    );

    expect(analyzerPlugin).toBeUndefined();

    process.env.ANALYZE = originalEnv;
  });
});
