import Button from "@/components/Button";
import OpenMap from "@/components/OpenMap";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colours } from "../constants/colours";
import { fontStyles } from "../constants/fonts";
import { useBeachStore } from "../store/beaches";
import { changeRegion, waterTemp } from "../utils/utils";

const BeachDetails = () => {
  const { beachId } = useLocalSearchParams<{ beachId: string }>();
  const { beaches, favouriteBeaches, toggleFavouriteBeach } = useBeachStore();
  const [isFavourite, setIsFavourite] = useState(false);

  const beach = [...beaches, ...favouriteBeaches].find((b) => b.id === beachId);

  if (!beach) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Praia não encontrada</Text>
      </SafeAreaView>
    );
  }

  useEffect(() => {
    setIsFavourite(favouriteBeaches.some((b) => b.id === beachId));
  }, [beachId, favouriteBeaches]);

  const handleFavouriteBeach = () => {
    toggleFavouriteBeach(beach);
    setIsFavourite(!isFavourite);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{beach.name}</Text>
          <FontAwesome
            testID="heart-icon"
            name="heart"
            size={24}
            color={isFavourite ? colours.red : colours.black}
            onPress={handleFavouriteBeach}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>
            Região:{" "}
            <Text style={styles.infoValue}>{changeRegion(beach.region)}</Text>
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>
            Temperatura da Água: {""}{" "}
            <Text style={styles.infoValue}>{waterTemp(beach.waterTemp)}</Text>
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>
            Mar:{" "}
            <Text style={styles.infoValue}>
              {beach.waves ? "Agitado" : "Calmo"}
            </Text>
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>
            Descrição:{" "}
            <Text
              style={styles.infoValue}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {beach.description}
            </Text>
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Button onPress={() => OpenMap(beach.name)}>
            <Text style={styles.infoTitle}>Ver no mapa</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  title: {
    ...fontStyles.title,
    color: colours.black,
    marginBottom: 30,
    textAlign: "center",
  },
  infoContainer: {
    backgroundColor: colours.primary,
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
  },
  infoTitle: {
    ...fontStyles.bold18,
    color: colours.black,
    marginBottom: 5,
  },
  infoValue: {
    ...fontStyles.medium18,
    color: colours.black,
  },
  errorText: {
    ...fontStyles.title,
    color: colours.black,
    textAlign: "center",
    marginTop: 20,
  },
});

export default BeachDetails;
