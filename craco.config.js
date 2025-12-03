const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  webpack: {
    plugins: {
      add: [
        // Gzip compression for production builds
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 8192, // Only compress files > 8KB
          minRatio: 0.8,
        }),
      ],
    },
    configure: (webpackConfig, { env }) => {
      // Add bundle analyzer in analyze mode
      if (process.env.ANALYZE === 'true') {
        webpackConfig.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'bundle-report.html',
            openAnalyzer: true,
            generateStatsFile: true,
            statsFilename: 'bundle-stats.json',
          })
        );
      }

      // Production optimizations
      if (env === 'production') {
        // Optimize chunk splitting
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          usedExports: true,
          sideEffects: true,
          splitChunks: {
            chunks: 'all',
            maxInitialRequests: 25,
            minSize: 20000,
            cacheGroups: {
              // Separate Three.js into its own chunk
              three: {
                test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
                name: 'three-vendor',
                chunks: 'all',
                priority: 30,
              },
              // React ecosystem
              react: {
                test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
                name: 'react-vendor',
                chunks: 'all',
                priority: 20,
              },
              // Other vendors
              vendors: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                priority: 10,
                reuseExistingChunk: true,
              },
            },
          },
        };

        // Minimize with better terser options
        if (webpackConfig.optimization.minimizer) {
          webpackConfig.optimization.minimizer.forEach((minimizer) => {
            if (minimizer.constructor.name === 'TerserPlugin') {
              minimizer.options.terserOptions = {
                ...minimizer.options.terserOptions,
                compress: {
                  drop_console: true, // Remove console.logs in production
                  drop_debugger: true,
                  pure_funcs: ['console.log', 'console.info', 'console.debug'],
                },
                mangle: true,
                output: {
                  comments: false,
                },
              };
            }
          });
        }
      }

      return webpackConfig;
    },
  },
};
