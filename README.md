# React Native Social Login

A simple and flexible React Native package for Google and Apple authentication with customizable buttons.

## Installation

```bash
npm install @agonzalezwww/react-native-social-login
```

**Peer Dependencies:**
```bash
npm install @react-native-google-signin/google-signin expo-apple-authentication
```

> **⚠️ Note:** This package requires custom native code and cannot be used in Expo Go. Use development builds or bare React Native workflow.

## Quick Start

```typescript
import { AuthButton, GoogleLogin, AppleLogin } from '@agonzalezwww/react-native-social-login';

export default function LoginScreen() {
  const handleGoogleLogin = async () => {
    try {
      const user = await GoogleLogin.Login({
        iosClientId: 'your-ios-client-id',
        webClientId: 'your-web-client-id',
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
      <AuthButton provider="google" onPress={handleGoogleLogin} />
      <AuthButton provider="apple" onPress={handleAppleLogin} />
    </>
  );
}
```

## Components

### AuthButton (Unified Component)

```typescript
<AuthButton 
  provider="google" | "apple"
  onPress={() => Promise<void> | void}
  disabled={boolean}
  loading={boolean}
  buttonHeight={number}
  googleProps={Partial<GoogleAuthButtonProps>}
  appleProps={Partial<AppleAuthButtonProps>}
/>
```

### Individual Components

```typescript
import { GoogleAuthButton, AppleAuthButton } from '@agonzalezwww/react-native-social-login';

<GoogleAuthButton 
  onPress={handleLogin}
  mode="login" | "signup"
  buttonHeight={48}
  buttonStyle={ViewStyle}
  hideIcon={boolean}
/>

<AppleAuthButton 
  onPress={handleLogin}
  buttonText="signin" | "signup" | "continue"
  buttonStyle="white" | "white-outline" | "black"
  buttonHeight={48}
  cornerRadius={4}
/>
```

## Services

### Google Login

```typescript
// Configure once, use multiple times
GoogleLogin.configure({
  iosClientId: 'your-ios-client-id',
  webClientId: 'your-web-client-id',
});

const user = await GoogleLogin.signIn();
const isSignedIn = await GoogleLogin.isSignedIn();
await GoogleLogin.signOut();

// Or configure and login in one step
const user = await GoogleLogin.Login({ iosClientId: '...', webClientId: '...' });
```

### Apple Login

```typescript
// Basic login
const result = await AppleLogin.Login();

// With custom scopes
const result = await AppleLogin.Login({
  requestedScopes: [AppleAuthenticationScope.EMAIL, AppleAuthenticationScope.FULL_NAME],
});

// Utilities
const isAvailable = await AppleLogin.isAvailable();
const isAuthenticated = await AppleLogin.isUserAuthenticated(userId);
```

## Setup

### Google Sign-In Setup

1. **Get credentials from [Firebase Console](https://console.firebase.google.com/) or [Google Cloud Console](https://console.cloud.google.com/)**
   - Create iOS and Android OAuth clients with your bundle identifiers
   - Note your **Web Client ID** (use this in your code, not iOS Client ID)

2. **Configure your app based on your setup:**

   **Option A: Expo with Firebase Authentication**
   
   Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) from Firebase Console and place them in your project root:
   
   ```json
   {
     "expo": {
       "plugins": ["@react-native-google-signin/google-signin"],
       "android": {
         "googleServicesFile": "./google-services.json"
       },
       "ios": {
         "googleServicesFile": "./GoogleService-Info.plist"
       }
     }
   }
   ```

   **Option B: Expo without Firebase**
   
   If you're not using Firebase, provide the `iosUrlScheme` option:
   
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

   **Bare Workflow:**
   ```bash
   cd ios && pod install
   ```

3. **Rebuild your app:**
   ```bash
   npx expo prebuild --clean
   npx expo run:android && npx expo run:ios
   ```

   > **Note**: This package cannot be used in Expo Go. Use development builds for testing.

### Apple Sign-In Setup

1. **Enable "Sign In with Apple" in your [Apple Developer Console](https://developer.apple.com/) App ID**

2. **Configure your app:**

   **Expo/Managed Workflow:**
   ```json
   {
     "expo": {
       "ios": {
         "bundleIdentifier": "com.yourcompany.yourapp",
         "usesAppleSignIn": true
       },
       "plugins": ["expo-apple-authentication"]
     }
   }
   ```

   **Bare Workflow:**
   ```xml
   <!-- Info.plist -->
   <key>NSAppleAuthenticationEnabled</key>
   <true/>
   ```

## TypeScript

Full TypeScript support included:

```typescript
import type { 
  AppleAuthResult, 
  AppleAuthConfig,
  GoogleAuthButtonProps,
  AppleAuthButtonProps 
} from '@agonzalezwww/react-native-social-login';
```

## Requirements

- **React Native:** 0.70+
- **iOS:** 13+ (for Apple Sign-In)
- **Android:** API level 21+

## License

MIT