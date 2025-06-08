# Expo Development Build Instructions

## Step 1: Create Expo Account & Login
1. Go to https://expo.dev and create a free account
2. In terminal, run: `eas login`
3. Enter your Expo credentials

## Step 2: Initialize EAS Project
```bash
eas build:configure
```
This will generate a project ID and update your app.json

## Step 3: Build Development Version
```bash
# For iOS (requires Apple Developer account for device installation)
eas build --platform ios --profile development

# For Android (can install directly via APK)
eas build --platform android --profile development
```

## Step 4: Build Preview Version (Recommended for sharing)
```bash
# For both platforms
eas build --platform all --profile preview

# Or individual platforms
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

## Step 5: Share with Friends

### Option A: Direct Download
- After build completes, you'll get download links
- Share the APK (Android) or IPA (iOS) links with friends
- Android: Friends can install directly after enabling "Install from unknown sources"
- iOS: Requires TestFlight or device UDID registration

### Option B: Expo Go (Development only)
```bash
npm start
# Share QR code - friends scan with Expo Go app
```

## Build Profiles Explained:

- **development**: Full development features, requires Expo Dev Client
- **preview**: Production-like build for testing, can be distributed
- **production**: Final build for App Store/Play Store

## Sharing Options:

1. **Easiest**: Use `preview` profile and share APK/IPA links
2. **Best for testing**: Use Firebase App Distribution or TestFlight
3. **Quick testing**: Use Expo Go with development server

## Next Steps After Login:
1. Run `eas build:configure` to set up project
2. Run `eas build --platform android --profile preview` for Android APK
3. Share the download link with friends