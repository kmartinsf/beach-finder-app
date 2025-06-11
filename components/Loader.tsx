import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colours } from "../constants/colours";

const Loader = ({ loading }: { loading: boolean }) => {
  if (!loading) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size={100}
        color={colours.primary}
        testID="activity-indicator"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.75)",
  },
});

export default Loader;
