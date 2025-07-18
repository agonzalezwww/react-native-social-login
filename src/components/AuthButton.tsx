import React from "react";
import { AppleAuthButton, type AppleAuthButtonProps } from "./AppleAuthButton";
import { GoogleAuthButton, type GoogleAuthButtonProps } from "./GoogleAuthButton";

type AuthButtonProps = {
  provider: 'google' | 'apple';
  onPress: () => Promise<void> | void;
  disabled?: boolean;
  buttonHeight?: number;
  
  googleProps?: Partial<GoogleAuthButtonProps>;
  appleProps?: Partial<AppleAuthButtonProps>;
};

export function AuthButton({ 
  provider, 
  onPress, 
  disabled, 
  buttonHeight,
  googleProps,
  appleProps 
}: AuthButtonProps) {
  if (provider === 'google') {
    return (
      <GoogleAuthButton 
        onPress={onPress}
        disabled={disabled}
        buttonHeight={buttonHeight}
        {...googleProps}
      />
    );
  }
  
  if (provider === 'apple') {
    return (
      <AppleAuthButton 
        onPress={onPress}
        disabled={disabled}
        buttonHeight={buttonHeight}
        {...appleProps}
      />
    );
  }
  
  return null;
} 