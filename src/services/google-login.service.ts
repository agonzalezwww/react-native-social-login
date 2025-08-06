import {
  GoogleSignin,
  User,
} from "@react-native-google-signin/google-signin";
import { SocialAuthUser, GoogleAuthResponse } from "../types";

class GoogleLogin {
  private static isConfigured = false;

  static configure(options: {
    iosClientId: string;
    webClientId: string;
    offlineAccess?: boolean;
  }) {
    if (!options.iosClientId || !options.webClientId) {
      throw new Error("Google client IDs not properly configured");
    }
    GoogleSignin.configure({
      iosClientId: options.iosClientId,
      webClientId: options.webClientId,
      offlineAccess: options.offlineAccess ?? true,
    });
    this.isConfigured = true;
  }

  static config = GoogleLogin.configure;

  static async signIn(): Promise<SocialAuthUser> {
    if (!this.isConfigured) {
      throw new Error("GoogleLogin not configured. Call configure() first.");
    }
    try {
      await GoogleSignin.hasPlayServices();
      const googleResponse: {data: User, type: string} = await GoogleSignin.signIn() as unknown as {data: User, type: string};
      const googleDataResponse: GoogleAuthResponse = {
        data: googleResponse.data,
        type: googleResponse.type,
      }
      // Map Google response to unified format
      return this.mapGoogleResponseToUnifiedUser(googleDataResponse.data);
    } catch (error) {
      throw error;
    }
  }

  static async signOut(): Promise<void> {
    if (!this.isConfigured) {
      throw new Error("GoogleLogin not configured. Call configure() first.");
    }
    await GoogleSignin.signOut();
  }

  static async isSignedIn(): Promise<boolean> {
    if (!this.isConfigured) {
      throw new Error("GoogleLogin not configured. Call configure() first.");
    }
    return await GoogleSignin.isSignedIn();
  }

  static async getCurrentUser(): Promise<SocialAuthUser | null> {
    if (!this.isConfigured) {
      throw new Error("GoogleLogin not configured. Call configure() first.");
    }
    const googleUser = await GoogleSignin.getCurrentUser();
    if (!googleUser) return null;
    
    return this.mapGoogleResponseToUnifiedUser(googleUser);
  }

  static async Login(config: {
    iosClientId: string;
    webClientId: string;
    offlineAccess?: boolean;
  }): Promise<SocialAuthUser> {
    try {
      this.configure(config);
      return await this.signIn();
    } catch (error) {
      throw error;
    }
  }

  // Helper method to map Google response to unified format
  private static mapGoogleResponseToUnifiedUser(googleResponse: User): SocialAuthUser {
    return {
      id: googleResponse.user.id,
      email: googleResponse.user.email,
      name: googleResponse.user.name,
      givenName: googleResponse.user.givenName,
      familyName: googleResponse.user.familyName,
      photo: googleResponse.user.photo,
      idToken: googleResponse.idToken,
      serverAuthCode: googleResponse.serverAuthCode,
      scopes: googleResponse.scopes,
    };
  }
}

export { GoogleLogin }; 