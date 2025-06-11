import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { fetchQuestions, seedDatabase } from "../firebase";

import {
  LeagueSpartan_400Regular,
  LeagueSpartan_500Medium,
  LeagueSpartan_700Bold,
} from "@expo-google-fonts/league-spartan";

SplashScreen.preventAutoHideAsync();

const initializeDatabase = async () => {
  try {
    const isSeeded = await AsyncStorage.getItem("@isDatabaseSeeded");

    if (isSeeded === "true") {
      await fetchQuestions();
      return;
    }

    await seedDatabase();
    await fetchQuestions();
    await AsyncStorage.setItem("@isDatabaseSeeded", "true");
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
      if (!fontsLoaded) return;

      await initializeDatabase();
      await SplashScreen.hideAsync();
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
