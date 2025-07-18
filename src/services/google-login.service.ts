import {
  GoogleSignin,
  type User,
} from "@react-native-google-signin/google-signin";

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

  static async signIn(): Promise<User> {
    if (!this.isConfigured) {
      throw new Error("GoogleLogin not configured. Call configure() first.");
    }
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      return user;
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

  static async getCurrentUser(): Promise<User | null> {
    if (!this.isConfigured) {
      throw new Error("GoogleLogin not configured. Call configure() first.");
    }
    return await GoogleSignin.getCurrentUser();
  }

  static async Login(config: {
    iosClientId: string;
    webClientId: string;
    offlineAccess?: boolean;
  }): Promise<User> {
    try {
      this.configure(config);
      return await this.signIn();
    } catch (error) {
      throw error;
    }
  }
}

export { GoogleLogin }; 