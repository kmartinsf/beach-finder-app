import { Pressable, StyleSheet, Text, View } from "react-native";
import { colours } from "../constants/colours";
import { fontStyles } from "../constants/fonts";

const UniqueBeach = ({
  onPress,
  children,
  testID,
}: {
  onPress: () => void;
  children: React.ReactNode;
  testID?: string;
}) => {
  return (
    <Pressable onPress={onPress} testID={testID}>
      <View style={styles.item}>
        <Text style={styles.beachNameTitle}>{children}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: colours.primary,
    borderRadius: 16,
    padding: 12,
    marginVertical: 10,
    alignItems: "center",
  },
  beachNameTitle: {
    ...fontStyles.bold20,
  },
});

export default UniqueBeach;
