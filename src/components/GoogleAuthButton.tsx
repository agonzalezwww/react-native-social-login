import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  Pressable,
  ViewStyle,
  DimensionValue,
  ActivityIndicator,
} from "react-native";

const googleIcon = require("../../assets/icons/google.png");

export type GoogleAuthButtonProps = {
  onPress: () => Promise<void> | void;
  mode?: "login" | "signup";
  disabled?: boolean;
  loading?: boolean;
  loginText?: string;
  signupText?: string;
  loadingText?: string;
  buttonStyle?: ViewStyle;
  buttonHeight?: number;
  buttonWidth?: DimensionValue;
  hideIcon?: boolean;
  iconSize?: number;
};

export function GoogleAuthButton({
  onPress,
  mode = "login",
  disabled = false,
  loading = false,
  loginText = "Sign in with Google",
  signupText = "Sign up with Google",
  loadingText,
  buttonStyle,
  buttonHeight = 48,
  buttonWidth = "100%",
  hideIcon = false,
  iconSize = 18,
}: GoogleAuthButtonProps) {
  const handlePress = () => {
    if (disabled || loading) return;
    try {
      onPress?.();
    } catch (error) {
      console.warn('Google Sign-In not properly configured. Please check your setup.');
      console.warn(error);
    }
  };

  const isButtonDisabled = disabled || loading;
  const buttonText = loading && loadingText 
    ? loadingText 
    : mode === "login" ? loginText : signupText;

  const containerStyle: ViewStyle = {
    ...styles.button,
    height: buttonHeight,
    width: buttonWidth,
    ...buttonStyle,
  };

  const iconStyle = [
    styles.googleIcon, 
    { width: iconSize, height: iconSize }
  ];

  const renderIcon = () => {
    if (loading) {
      return React.createElement(ActivityIndicator as any, {
        size: "small",
        color: "#3c4043",
        style: styles.loadingIndicator,
      });
    }
    
    if (hideIcon) return null;
    
    return React.createElement(Image as any, {
      source: googleIcon,
      style: iconStyle,
      resizeMode: "contain",
    });
  };

  const renderText = () => {
    return React.createElement(Text as any, {
      style: styles.buttonText,
      children: buttonText,
    });
  };

  return React.createElement(Pressable as any, {
    style: ({ pressed }: any) => ({
      ...containerStyle,
      opacity: (isButtonDisabled || pressed) ? 0.7 : 1,
    }),
    onPress: handlePress,
    disabled: isButtonDisabled,
  }, renderIcon(), renderText());
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dadce0",
    borderRadius: 4,
  },
  buttonText: {
    color: "#3c4043",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
    textAlign: "center",
  },
  googleIcon: {
    width: 18,
    height: 18,
  },
  loadingIndicator: {
    marginRight: 0,
  },
}); 