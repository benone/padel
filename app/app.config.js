export default {
  name: "Padel Booking",
  slug: "padestar",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  packagerOpts: {
    port: 8082
  },
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#1e3a4a"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.kirill.padel.booking",
    buildNumber: "2",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.kirill.padel.booking",
    edgeToEdgeEnabled: true
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    // Production API URL - will be available as Constants.expoConfig.extra.apiBaseUrl
    apiBaseUrl: process.env.API_BASE_URL,
    eas: {
      projectId: "905c3099-761f-41a0-b78e-6b35f90e528a"
    }
  },
  owner: "akvastar"
};
