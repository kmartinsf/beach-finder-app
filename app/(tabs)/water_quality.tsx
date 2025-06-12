import { colours } from "@/constants/colours";
import { fontStyles } from "@/constants/fonts";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const WaterQualityScreen = () => {
  const waterQualityUrl = "https://balneabilidade.ima.sc.gov.br/";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webviewContainer}>
        <WebView
          source={{ uri: waterQualityUrl }}
          style={styles.webview}
          renderLoading={() => (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colours.primary} />
              <Text style={styles.loadingText}>
                Carregando dados de balneabilidade...
              </Text>
            </View>
          )}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
          injectedJavaScript={`
            const style = document.createElement('style');
            style.innerHTML = \`
              #sliderContainer { display: none !important; }
              .nav-side-menu { display: none !important; }
            \`;
            document.head.appendChild(style);
            true;`}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
    padding: 20,
  },

  webviewContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colours.primary,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colours.secondaryBackground,
  },
  loadingText: {
    ...fontStyles.bodyRegular,
    color: colours.black,
    marginTop: 10,
  },
});

export default WaterQualityScreen;
