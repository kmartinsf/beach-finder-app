import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import {
  LeagueSpartan_400Regular,
  LeagueSpartan_500Medium,
  LeagueSpartan_700Bold,
} from "@expo-google-fonts/league-spartan";

import { fetchQuestions, repopulateDatabase } from "@/utils/internal/firebase";

SplashScreen.preventAutoHideAsync();

const initializeDatabase = async () => {
  try {
    const isSeeded = await AsyncStorage.getItem("@isDatabaseSeeded");
    const forceRepopulate = false;

    if (forceRepopulate || isSeeded !== "true") {
      await repopulateDatabase();
      await AsyncStorage.setItem("@isDatabaseSeeded", "true");
    } else {
      await fetchQuestions();
    }
  } catch (error) {
    throw error;
  }
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "LeagueSpartan-Regular": LeagueSpartan_400Regular,
    "LeagueSpartan-Medium": LeagueSpartan_500Medium,
    "LeagueSpartan-Bold": LeagueSpartan_700Bold,
  });

  useEffect(() => {
    const prepare = async () => {
      try {
        if (!fontsLoaded) return;

        await initializeDatabase();
      } catch (error) {
        throw error;
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="result"
          options={{
            headerShown: true,
            title: "",
          }}
        />
        <Stack.Screen
          name="beach_details"
          options={{
            headerShown: true,
            title: "",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
