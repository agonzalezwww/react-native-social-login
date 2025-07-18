import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  Pressable,
  ViewStyle,
  DimensionValue,
} from "react-native";

const googleIcon = require("../../assets/icons/google.png");

export type GoogleAuthButtonProps = {
  onPress: () => Promise<void> | void;
  mode?: "login" | "signup";
  disabled?: boolean;
  loginText?: string;
  signupText?: string;
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
  loginText = "Sign in with Google",
  signupText = "Sign up with Google",
  buttonStyle,
  buttonHeight = 48,
  buttonWidth = "100%",
  hideIcon = false,
  iconSize = 18,
}: GoogleAuthButtonProps) {
  const handlePress = () => {
    if (disabled) return;
    onPress?.();
  };

  const buttonText = mode === "login" ? loginText : signupText;

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
      opacity: (disabled || pressed) ? 0.7 : 1,
    }),
    onPress: handlePress,
    disabled: disabled,
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
}); 