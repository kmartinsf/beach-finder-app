import { useNavigation } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import UniqueBeach from "../../components/UniqueBeach";
import { colours } from "../../constants/colours";
import { fontStyles } from "../../constants/fonts";
import { useBeachStore } from "../../store/beaches";
import { Beach } from "../../types/beaches";
import { RootStackParamList } from "../../types/navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function FavouritesScreen() {
  const { favouriteBeaches } = useBeachStore();

  const navigation = useNavigation<NavigationProp>();

  const goToBeachDetails = (beach: Beach) => {
    setTimeout(() => {
      navigation.navigate("beach_details", {
        beachId: beach.id || "beach-" + Math.random().toString(),
      });
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confira as praias que você mais ama!</Text>
      <View style={styles.content}>
        <FlatList
          style={{ flexGrow: 0 }}
          data={favouriteBeaches}
          renderItem={({ item }) => (
            <UniqueBeach onPress={() => goToBeachDetails(item)}>
              <Text>{item.name}</Text>
            </UniqueBeach>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
    padding: 20,
    justifyContent: "flex-start",
  },
  content: {
    justifyContent: "center",
  },
  title: {
    ...fontStyles.title28,
    color: colours.black,
    textAlign: "center",
    marginTop: 80,
    marginBottom: 40,
  },
});
