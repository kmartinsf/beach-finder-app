import { FontAwesome5 } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#080E0EFF",
        tabBarInactiveTintColor: "#B8B8B8FF",
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: "transparent",
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Página Inicial",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favoritas",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="star" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
