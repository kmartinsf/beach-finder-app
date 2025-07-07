import QuizModal from "@/components/QuizModal";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import UniqueBeach from "../components/UniqueBeach";
import { colours } from "../constants/colours";
import { fontStyles } from "../constants/fonts";
import { useBeachStore } from "../store/beaches";
import { useQuestionStore } from "../store/question";
import { Beach } from "../types/beaches";
import { RootStackParamList } from "../types/navigation";
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ResultScreen = () => {
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const { beaches: allBeaches } = useBeachStore();
  const { setSelectedAnswers } = useQuestionStore();
  const [isResultModalVisible, setResultModalVisible] = useState(false);
  const [randomBeach, setRandomBeach] = useState(true);
  const navigation = useNavigation<NavigationProp>();
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    setBeaches(allBeaches);
  }, [allBeaches]);

  const getRandomBeach = () => {
    const randomIndex = Math.floor(Math.random() * allBeaches.length);
    setBeaches([allBeaches[randomIndex]]);
    setRandomBeach(false);
  };

  const toggleModal = () => {
    setResultModalVisible(!isResultModalVisible);
  };

  const goToBeachDetails = (beach: Beach) => {
    setNavigating(true);
    setTimeout(() => {
      navigation.navigate("beach_details", {
        beachId: beach.id || "beach-" + Math.random().toString(),
      });
    }, 1000);
  };

  useFocusEffect(
    useCallback(() => {
      setSelectedAnswers([]);
      return () => {
        setSelectedAnswers([]);
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {beaches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma praia encontrada!</Text>
          <Text style={styles.emptySubtext}>
            Refaça o quiz para encontrar uma praia perfeita!
          </Text>

          <Button onPress={toggleModal} style={styles.retakeQuizBtn}>
            <Text style={styles.buttonText}>Refazer</Text>
          </Button>

          <QuizModal
            isVisible={isResultModalVisible}
            onClose={() => setResultModalVisible(false)}
          />
        </View>
      ) : (
        <>
          <Text style={styles.questionTitle}>Que tal:</Text>
          <FlatList
            style={{ marginVertical: 20 }}
            data={beaches}
            keyExtractor={(item) =>
              item.id?.toString() || "beach-" + Math.random().toString()
            }
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <UniqueBeach
                onPress={() => goToBeachDetails(item)}
                testID="unique-beach"
              >
                {item.name}
              </UniqueBeach>
            )}
          />

          {randomBeach && (
            <View style={styles.randomBeachArea}>
              <Text style={styles.randomBeachText}>Não quer escolher?</Text>
              <Button onPress={getRandomBeach} style={styles.randomBeachButton}>
                <Text style={styles.randomBeachButtonText}>
                  Sorteie uma praia
                </Text>
              </Button>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    ...fontStyles.title,
    color: colours.black,
    letterSpacing: 0.5,
  },

  emptySubtext: {
    ...fontStyles.medium18,
    color: colours.black,
    textAlign: "center",
    marginVertical: 30,
  },

  questionTitle: {
    color: colours.black,
    ...fontStyles.title,
    textAlign: "center",
  },

  retakeQuizBtn: {
    backgroundColor: colours.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
  },

  buttonText: {
    color: colours.white,
    ...fontStyles.medium18,
  },

  randomBeachArea: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  randomBeachText: {
    ...fontStyles.medium22,
    color: colours.black,
  },

  randomBeachButton: {
    borderRadius: 8,
    backgroundColor: colours.primary,
    padding: 12,
  },

  randomBeachButtonText: {
    ...fontStyles.medium22,
    color: colours.white,
  },
});

export default ResultScreen;
