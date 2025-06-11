import { Link, Stack } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { colours } from "../constants/colours";
import { fontStyles } from "../constants/fonts";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Parece que não tem nada por aqui</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Voltar para o início</Text>
        </Link>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    ...fontStyles.title,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    ...fontStyles.subtitle,
    color: colours.primary,
  },
});
