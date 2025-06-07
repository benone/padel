const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Set default port to 8082
config.server = {
  ...config.server,
  port: 8082,
};

module.exports = withNativeWind(config, { input: './global.css' });