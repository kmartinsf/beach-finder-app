import QuizModal from "@/components/QuizModal";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import { colours } from "../../constants/colours";
import { fontStyles } from "../../constants/fonts";

import { PermissionsAndroid } from "react-native";
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

import messaging from "@react-native-firebase/messaging";

const HomeScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const requestToken = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      console.log("token", token);
    } catch (error) {
      throw error;
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (res === PermissionsAndroid.RESULTS.GRANTED) {
        requestToken();
      } else {
        Alert.alert(
          "Permissão de notificações negada",
          "Você não receberá notificações."
        );
      }
    } catch (error) {}
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);


  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("Mensagem recebida em primeiro plano:", remoteMessage);
      Alert.alert(
        "Nova notificação",
        remoteMessage.notification?.title || "Você tem uma nova mensagem!",
        [
          {
            text: "Fechar",
            style: "cancel",
          },
          {
            text: "Ver",
            onPress: () => {
              console.log("Ver notificação");
            },
          },
        ]
      );
    });

    return unsubscribe;
  }, [])
  

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
