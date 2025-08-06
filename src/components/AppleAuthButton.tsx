import React from "react";
import { ViewStyle, View, ActivityIndicator, StyleSheet } from "react-native";
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
  loading?: boolean;
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
  loading = false,
}: AppleAuthButtonProps) {
  const [isAvailable, setIsAvailable] = React.useState(false);

  React.useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setIsAvailable);
  }, []);

  if (!isAvailable) {
    return null;
  }

  const handlePress = () => {
    if (disabled || loading) return;
    onPress?.();
  };

  const isButtonDisabled = disabled || loading;

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
    ...(isButtonDisabled && { opacity: 0.6 }),
    ...(isButtonDisabled && { pointerEvents: 'none' }),
    ...containerStyle,
  };

  const getActivityIndicatorColor = () => {
    switch (buttonStyle) {
      case "white":
      case "white-outline":
        return "#000000";
      case "black":
      default:
        return "#ffffff";
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={[buttonStyles, styles.loadingContainer]}>
          <ActivityIndicator 
            size="small" 
            color={getActivityIndicatorColor()} 
          />
        </View>
      ) : (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={nativeButtonType}
          buttonStyle={nativeButtonStyle}
          cornerRadius={cornerRadius}
          style={buttonStyles}
          onPress={handlePress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
}); 