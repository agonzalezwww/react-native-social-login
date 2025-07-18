# React Native Social Login

A simple and flexible React Native package for Google and Apple authentication with clean, customizable buttons.

## Installation

```bash
npm install @agonzalezwww/react-native-social-login
```

### Peer Dependencies
```bash
npm install @react-native-google-signin/google-signin expo-apple-authentication
```

> **⚠️ Important: Expo Go Limitation**
> 
> This package **cannot be used in Expo Go** because it requires custom native code. You must use:
> - **Development builds** (`expo install --dev-client` + `eas build --profile development`)
> - **Production builds** (`eas build`)
> - **Bare React Native workflow**
>
> See [Expo's custom native code guide](https://docs.expo.dev/workflow/customizing/) for more details.

## Quick Start

### Basic Usage

```typescript
import React from 'react';
import { AuthButton, GoogleLogin, AppleLogin } from '@agonzalezwww/react-native-social-login';

export default function LoginScreen() {
  const handleGoogleLogin = async () => {
    try {
      const user = await GoogleLogin.Login({
        iosClientId: 'your-ios-client-id',
        webClientId: 'your-web-client-id', // Use WEB Client ID, not iOS Client ID
      });
      console.log('Google user:', user);
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleAppleLogin = async () => {
    try {
      const result = await AppleLogin.Login();
      console.log('Apple user:', result);
    } catch (error) {
      console.error('Apple login failed:', error);
    }
  };

  return (
    <>
      <AuthButton 
        provider="google" 
        onPress={handleGoogleLogin} 
      />
      
      <AuthButton 
        provider="apple" 
        onPress={handleAppleLogin} 
      />
    </>
  );
}
```

## AuthButton Component

The `AuthButton` is a unified component that renders either Google or Apple authentication buttons based on the provider.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `provider` | `'google' \| 'apple'` | - | **Required.** Which authentication provider to use |
| `onPress` | `() => Promise<void> \| void` | - | **Required.** Function called when button is pressed |
| `disabled` | `boolean` | `false` | Disables the button |
| `buttonHeight` | `number` | `48` | Height of the button |
| `googleProps` | `Partial<GoogleAuthButtonProps>` | - | Google-specific customization |
| `appleProps` | `Partial<AppleAuthButtonProps>` | - | Apple-specific customization |

## Customization

### Google Button Customization

```typescript
<AuthButton 
  provider="google"
  onPress={handleLogin}
  buttonHeight={56}
  googleProps={{
    mode: "signup",
    signupText: "Create account with Google",
    hideIcon: false,
    iconSize: 20,
    buttonStyle: {
      backgroundColor: "#f0f0f0",
      borderRadius: 8,
    }
  }}
/>
```

#### Google Props
- `mode`: `"login" | "signup"` - Changes button text
- `loginText`: Custom text for login mode
- `signupText`: Custom text for signup mode
- `hideIcon`: Hide the Google icon
- `iconSize`: Size of Google icon
- `buttonStyle`: Custom ViewStyle object
- `buttonWidth`: Button width (DimensionValue)

### Apple Button Customization

```typescript
<AuthButton 
  provider="apple"
  onPress={handleLogin}
  buttonHeight={56}
  appleProps={{
    buttonText: "continue",
    buttonStyle: "white-outline",
    cornerRadius: 8,
    containerStyle: {
      marginTop: 16,
    }
  }}
/>
```

#### Apple Props
- `buttonText`: `"signin" | "signup" | "continue"` - Apple's official button types
- `buttonStyle`: `"white" | "white-outline" | "black"` - Apple's official styles
- `cornerRadius`: Button corner radius
- `buttonWidth`: Button width (number)
- `containerStyle`: Custom ViewStyle object

## Authentication Services

### Google Login

```typescript
import { GoogleLogin } from '@agonzalezwww/react-native-social-login';

// One-time configuration and login
const user = await GoogleLogin.Login({
  iosClientId: 'your-ios-client-id',
  webClientId: 'your-web-client-id',
  offlineAccess: true, // optional
});

// Or configure once, then use multiple times
GoogleLogin.configure({
  iosClientId: 'your-ios-client-id',
  webClientId: 'your-web-client-id', // IMPORTANT: Use WEB Client ID here
});

const user = await GoogleLogin.signIn();
const isSignedIn = await GoogleLogin.isSignedIn();
await GoogleLogin.signOut();
```

### Apple Login

> **📱 iOS Only:** Apple Sign-In is only available on iOS devices (iOS 13+). It does not work on Android or web platforms.
>
> **🏪 App Store Requirement:** According to Apple's App Store Review Guidelines, if your app supports third-party authentication (Google, Facebook, etc.), you must also offer Apple Sign-In as an option.

```typescript
import { AppleLogin } from '@agonzalezwww/react-native-social-login';

// Basic login
const result = await AppleLogin.Login();

// With custom scopes
const result = await AppleLogin.Login({
  requestedScopes: [
    AppleAuthenticationScope.EMAIL,
    AppleAuthenticationScope.FULL_NAME,
  ],
});

// Utility methods
const isAvailable = await AppleLogin.isAvailable();
const isAuthenticated = await AppleLogin.isUserAuthenticated(userId);
const fullName = AppleLogin.getFullName(result.fullName);
const isPrivate = AppleLogin.isPrivateEmail(result.email);
```

## Setup Requirements

### Google Sign-In Setup

1. **Get Google OAuth credentials:**
   
   **Firebase Setup (Recommended):**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create or select a project
   - Add iOS and Android apps with your exact bundle identifiers
   - Enable "Google" sign-in method in Authentication > Sign-in method
   - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   
   **Google Cloud Console Setup:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials for:
     - **Web Client ID** (required for both Firebase and non-Firebase)
     - **Android Client ID** (with SHA-1 fingerprint)
     - **iOS Client ID** (with bundle identifier)

2. **Configuration (Expo/Managed Workflow):**

   > **🔒 Security Warning for Public Repositories**
   > 
   > **DO NOT commit `google-services.json` and `GoogleService-Info.plist` to public repositories!** 
   > These files contain API keys, project IDs, and other sensitive configuration data.
   >
   > For public repos, use **Option B (EAS Secrets)** instead of Option A.

   **Option A: Private Repositories Only**
   - Download `google-services.json` from Firebase Console (for Android)
   - Download `GoogleService-Info.plist` from Firebase Console (for iOS)
   - Place both files in your project root, then add to `app.json`:
   ```json
   {
     "expo": {
       "plugins": ["@react-native-google-signin/google-signin"],
       "android": {
         "googleServicesFile": "./google-services.json",
         "package": "com.yourcompany.yourapp"
       },
       "ios": {
         "googleServicesFile": "./GoogleService-Info.plist",
         "bundleIdentifier": "com.yourcompany.yourapp"
       }
     }
   }
   ```

   **Option B: Public Repositories (Recommended) - Using EAS Secrets**
   
   1. **Download and secure your Firebase files:**

      **Add the following files to .gitignore to prevent accidental commits**
      - google-services.json
      - GoogleService-Info.plist

   2. **Upload files as EAS secrets:**
      ```bash
      # Upload Firebase configuration files as secrets
      eas secret:create --scope project --name GOOGLE_SERVICES_JSON --type file --value ./google-services.json
      eas secret:create --scope project --name GOOGLE_SERVICE_INFO_PLIST --type file --value ./GoogleService-Info.plist
      ```

   3. **Configure app.json to use secrets:**
      ```json
      {
        "expo": {
          "plugins": ["@react-native-google-signin/google-signin"],
          "android": {
            "googleServicesFile": "./google-services.json",
            "package": "com.yourcompany.yourapp"
          },
          "ios": {
            "googleServicesFile": "./GoogleService-Info.plist",
            "bundleIdentifier": "com.yourcompany.yourapp"
          }
        }
      }
      ```
      
   4. **EAS Build will automatically use the secret files during builds**

   **Option C: Without Firebase**
   ```json
   {
     "expo": {
       "plugins": [
         [
           "@react-native-google-signin/google-signin",
           {
             "iosUrlScheme": "com.googleusercontent.apps.YOUR_IOS_CLIENT_ID"
           }
         ]
       ]
     }
   }
   ```
   Replace `YOUR_IOS_CLIENT_ID` with your actual iOS Client ID.

3. **Configuration (Bare Workflow):**
   ```bash
   cd ios && pod install
   ```
   Add your iOS Client ID to `Info.plist`:
   ```xml
   <key>CFBundleURLTypes</key>
   <array>
     <dict>
       <key>CFBundleURLSchemes</key>
       <array>
         <string>com.googleusercontent.apps.YOUR_IOS_CLIENT_ID</string>
       </array>
     </dict>
   </array>
   ```

### Apple Sign-In Setup

1. **Apple Developer Console Configuration:**
   
   **Step 1: Configure your App ID**
   - Go to [Apple Developer Portal](https://developer.apple.com/) → Certificates, Identifiers & Profiles
   - Select your App ID (or create one if needed)
   - In **Capabilities**, enable **"Sign In with Apple"**
   - Save the configuration
   
   **Step 2: Update your Bundle ID in Expo**
   - Make sure your `app.json` has the correct bundle identifier:
   ```json
   {
     "expo": {
       "ios": {
         "bundleIdentifier": "com.yourcompany.yourapp"
       }
     }
   }
   ```
   - This **must match** the App ID you configured in Apple Developer Console

2. **Configuration (Expo/Managed Workflow):**
   Add to your `app.json`:
   ```json
   {
     "expo": {
       "ios": {
         "bundleIdentifier": "com.yourcompany.yourapp",
         "usesAppleSignIn": true,
       },
       "plugins": [
         "expo-apple-authentication"
       ]
     }
   }
   ```
   **Important:** Replace `com.yourcompany.yourapp` with your actual bundle identifier that matches your Apple Developer Console App ID.

3. **Configuration (Bare Workflow):**
   Add to your `Info.plist`:
   ```xml
   <key>NSAppleAuthenticationEnabled</key>
   <true/>
   ```

4. **Important Notes for Expo Apps:**
   - **Testing:** Apple Sign-In only works on **physical devices**, not simulators
   - **Bundle ID matching:** The `bundleIdentifier` in `app.json` **must exactly match** your Apple Developer Console App ID
   - **Development builds:** You'll need EAS development build (Expo Go doesn't support Apple Sign-In):
     ```bash
     eas build --profile development --platform ios
     ```
   - **Privacy Manifests:** iOS 17+ requires privacy manifest configuration for App Store submission
   - **Capabilities:** The `usesAppleSignIn: true` setting automatically handles capability configuration

## Individual Components

You can also use the individual components directly:

```typescript
import React from 'react';
import { 
  GoogleAuthButton, 
  AppleAuthButton 
} from '@agonzalezwww/react-native-social-login';

<GoogleAuthButton onPress={handleGoogleLogin} />
<AppleAuthButton onPress={handleAppleLogin} />
```

## TypeScript Support

This package is written in TypeScript and includes full type definitions:

```typescript
import type { 
  AppleAuthResult, 
  AppleAuthConfig,
  GoogleAuthButtonProps,
  AppleAuthButtonProps 
} from '@agonzalezwww/react-native-social-login';
```

## Troubleshooting

### Apple Sign-In Issues

**"Apple Sign-In is not available"**
- **Platform Check:** Apple Sign-In only works on iOS (13+), not Android/web
- **Physical Device Required:** Testing must be done on a real iOS device, not simulator
- **Bundle ID Matching:** Verify your `bundleIdentifier` in `app.json` exactly matches your Apple Developer Console App ID
- **Capability Enabled:** Check that "Sign In with Apple" capability is enabled in your App ID
- **Development Build:** Ensure you're using a development build, not Expo Go

**Button doesn't appear**
- Verify `expo-apple-authentication` plugin is in your `app.json` plugins array
- Check that `ios.usesAppleSignIn: true` is set in your `app.json`
- Ensure iOS version is 13+ on your test device
- Rebuild your app after adding Apple Sign-In configuration

**"Sign In with Apple temporarily unavailable"**
- This usually indicates a configuration mismatch
- Double-check your bundle identifier matches across all platforms
- Verify your Apple Developer account has the proper capabilities enabled
- Try signing out of iCloud and signing back in on your test device

### Google Sign-In Issues

**"Google Sign-In configuration error"**
- **With Firebase:** Make sure `google-services.json` and `GoogleService-Info.plist` are in project root and paths are correct in `app.json`
- **Without Firebase:** Verify your iOS Client ID is correct in the `iosUrlScheme`
- Check that bundle identifiers match exactly between Firebase/Google Console and your `app.json`

**SHA-1 Fingerprint Issues (Critical for Android)**
You need **two different SHA-1 fingerprints** for proper Google Sign-In:

1. **Development Fingerprint** (for testing with development builds):
   ```bash
   eas credentials
   ```
   Select Android → Download credentials → Extract SHA-1 from `upload-keystore.jks`

2. **Production Fingerprint** (for Play Store releases):
   - Get from Google Play Console → App Signing → App signing key certificate
   - Or upload your release keystore to Google Play Console

Add **both fingerprints** to your Google Cloud Console OAuth 2.0 Android client.

**Production Testing**
- Google Sign-In may not work properly in development builds
- For reliable testing, upload a production build to Google Play Store (internal testing track)
- This ensures proper certificate matching for authentication

**EAS Secrets for Public Repositories**
If you're using a public repository and need to secure your Firebase files, see **Option B** in the Google Sign-In Setup section above for complete EAS secrets configuration.

## Requirements

### Platform Support
- **React Native:** 0.70+
- **iOS:** 13+ (required for Apple Sign-In)
- **Android:** API level 21+ (required for Google Sign-In)

## License

MIT