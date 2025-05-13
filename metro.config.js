// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add this resolver config to ensure proper module resolution
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Ensure source maps are generated in production
config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: {
    keep_classnames: true,
    keep_fnames: true,
  },
};

config.resolver.sourceExts.push("cjs")
config.resolver.unstable_enablePackageExports = false
module.exports = config; 