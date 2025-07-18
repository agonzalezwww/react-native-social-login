import React from "react";
import { ViewStyle } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";

export type AppleAuthButtonProps = {
  onPress: () => Promise<void> | void;
  buttonText?: "signin" | "signup" | "continue";
  buttonStyle?: "white" | "white-outline" | "black";
  buttonHeight?: number;
  buttonWidth?: number;
  cornerRadius?: number;
  containerStyle?: ViewStyle;
  disabled?: boolean;
};

export function AppleAuthButton({
  onPress,
  buttonText = "signin",
  buttonStyle = "black",
  buttonHeight = 48,
  buttonWidth,
  cornerRadius = 4,
  containerStyle,
  disabled = false,
}: AppleAuthButtonProps) {
  const [isAvailable, setIsAvailable] = React.useState(false);

  React.useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setIsAvailable);
  }, []);

  if (!isAvailable) {
    return null;
  }

  const handlePress = () => {
    if (disabled) return;
    onPress?.();
  };

  const nativeButtonType = {
    signin: AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN,
    signup: AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP,
    continue: AppleAuthentication.AppleAuthenticationButtonType.CONTINUE,
  }[buttonText];

  const nativeButtonStyle = {
    white: AppleAuthentication.AppleAuthenticationButtonStyle.WHITE,
    "white-outline": AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE,
    black: AppleAuthentication.AppleAuthenticationButtonStyle.BLACK,
  }[buttonStyle];

  const buttonStyles: ViewStyle = {
    height: buttonHeight,
    minWidth: 140,
    ...(buttonWidth && { width: buttonWidth }),
    ...(disabled && { opacity: 0.6 }),
    ...(disabled && { pointerEvents: 'none' }),
    ...containerStyle,
  };

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={nativeButtonType}
      buttonStyle={nativeButtonStyle}
      cornerRadius={cornerRadius}
      style={buttonStyles}
      onPress={handlePress}
    />
  );
} 