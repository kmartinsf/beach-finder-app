import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import { colours } from "../../constants/colours";
import { fontStyles } from "../../constants/fonts";
import QuizModal from "@/components/QuizModal";

const HomeScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setModalVisible(false);
    }, [])
  );

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Encontre uma praia para hoje</Text>

      <Button onPress={toggleModal} style={styles.startButton}>
        <Text style={styles.buttonText}>Começar</Text>
      </Button>

      <QuizModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    ...fontStyles.title28,
    color: colours.black,
    textAlign: "center",
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: colours.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  buttonText: {
    color: colours.white,
    ...fontStyles.medium22,
  },
});

export default HomeScreen;
