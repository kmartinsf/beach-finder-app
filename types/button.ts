export type ButtonProps = {
  children: React.ReactNode;
  onPress: () => void;
  style?: object;
  disabled?: boolean;
};