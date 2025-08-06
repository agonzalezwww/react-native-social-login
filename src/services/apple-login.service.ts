import * as AppleAuthentication from "expo-apple-authentication";
import { SocialAuthUser, AppleAuthResponse } from "../types";

export interface AppleAuthResult {
  user: string;
  email?: string | null;
  fullName?: AppleAuthentication.AppleAuthenticationFullName | null;
  identityToken?: string | null;
  authorizationCode?: string | null;
  realUserStatus: AppleAuthentication.AppleAuthenticationUserDetectionStatus;
}

export interface AppleAuthConfig {
  requestedScopes?: AppleAuthentication.AppleAuthenticationScope[];
  nonce?: string;
  state?: string;
}

export class AppleLogin {
  static async isAvailable(): Promise<boolean> {
    try {
      return await AppleAuthentication.isAvailableAsync();
    } catch (error) {
      console.warn("Apple authentication check failed:", error);
      return false;
    }
  }

  static async signIn(config?: AppleAuthConfig): Promise<SocialAuthUser> {
    if (!(await this.isAvailable())) {
      throw new Error("Apple Sign-In is not available on this device");
    }

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: config?.requestedScopes || [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: config?.nonce,
        state: config?.state,
      });

      if (!credential || !credential.user) {
        throw new Error("Invalid response from Apple Sign-In");
      }

      // Map Apple response to unified format
      return this.mapAppleResponseToUnifiedUser(credential);
    } catch (error: any) {
      if (error.code === "ERR_CANCELED") {
        throw new Error("Sign-in was canceled");
      }
      throw new Error(`Apple Sign-In failed: ${error.message}`);
    }
  }

  static async isUserAuthenticated(user: string): Promise<boolean> {
    try {
      if (!(await this.isAvailable())) {
        return false;
      }
      
      const credentialState = await AppleAuthentication.getCredentialStateAsync(user);
      return credentialState === AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED;
    } catch (error) {
      console.warn("Could not verify user authentication:", error);
      return false;
    }
  }

  static getFullName(fullName?: AppleAuthentication.AppleAuthenticationFullName | null): string {
    if (!fullName) return "";
    
    const parts = [
      fullName.givenName,
      fullName.familyName,
    ].filter(Boolean);
    
    return parts.join(" ");
  }

  static isPrivateEmail(email?: string | null): boolean {
    return email?.includes("@privaterelay.appleid.com") || false;
  }

  static async SignIn(config?: AppleAuthConfig): Promise<SocialAuthUser> {
    return await this.signIn(config);
  }

  static async Login(options?: {
    requestedScopes?: AppleAuthentication.AppleAuthenticationScope[];
    nonce?: string;
    state?: string;
  }): Promise<SocialAuthUser> {
    return await this.signIn(options);
  }

  // Helper method to map Apple response to unified format
  private static mapAppleResponseToUnifiedUser(appleResponse: AppleAuthentication.AppleAuthenticationCredential): SocialAuthUser {
    const fullName = appleResponse.fullName;
    const name = fullName ? this.getFullName(fullName) : null;
    
    return {
      id: appleResponse.user,
      email: appleResponse.email,
      name: name,
      givenName: fullName?.givenName || null,
      familyName: fullName?.familyName || null,
      photo: null, // Apple doesn't provide profile photos
      identityToken: appleResponse.identityToken || null,
      authorizationCode: appleResponse.authorizationCode || null,
      realUserStatus: appleResponse.realUserStatus,
    };
  }
}

export const login = AppleLogin.signIn;
export default AppleLogin; 