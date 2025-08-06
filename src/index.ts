export { GoogleAuthButton } from './components/GoogleAuthButton';
export { AppleAuthButton } from './components/AppleAuthButton';
export { AuthButton } from './components/AuthButton';

export { GoogleLogin } from './services/google-login.service';
export { AppleLogin } from './services/apple-login.service';

// Export unified types
export type { 
  SocialAuthUser, 
  GoogleAuthResponse, 
  AppleAuthResponse, 
  AuthProvider 
} from './types';

export type { AppleAuthConfig } from './services/apple-login.service';
export type { GoogleAuthButtonProps } from './components/GoogleAuthButton';
export type { AppleAuthButtonProps } from './components/AppleAuthButton'; 