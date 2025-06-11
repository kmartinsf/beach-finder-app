import { Pressable, StyleSheet } from "react-native";
import { ButtonProps } from "../types/button";

const Button = ({
  children,
  onPress,
  style,
  disabled = false,
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, style]}
      disabled={disabled}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Button;
