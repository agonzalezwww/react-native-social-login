// Unified User interface for both Google and Apple login
export interface SocialAuthUser {
  id: string;
  email: string | null;
  name: string | null;
  givenName: string | null;
  familyName: string | null;
  photo: string | null;
  idToken?: string | null;
  serverAuthCode?: string | null;
  authorizationCode?: string | null;
  identityToken?: string | null;
  realUserStatus?: number;
  scopes?: string[];
}

// The actual response structure from Google SignIn
export interface GoogleAuthResponse {
  data: {
    idToken: string;
    scopes?: string[];
    serverAuthCode: string;
    user: {
      email: string;
      familyName: string;
      givenName: string;
      id: string;
      name: string;
      photo: string;
    };
  };
  type: string;
}

export interface AppleAuthResponse {
  authorizationCode: string;
  email: string | null;
  fullName: {
    familyName: string | null;
    givenName: string | null;
    middleName: string | null;
    namePrefix: string | null;
    nameSuffix: string | null;
    nickname: string | null;
  } | null;
  identityToken: string;
  realUserStatus: number;
  user: string;
}

// Provider types
export type AuthProvider = 'google' | 'apple'; 