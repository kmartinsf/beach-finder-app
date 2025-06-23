import { findBeaches } from "@/utils/firebase";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
} from "react-native-gesture-handler";
import Modal from "react-native-modal";
import { colours } from "../constants/colours";
import { fontStyles } from "../constants/fonts";
import { useBeachStore } from "../store/beaches";
import { useQuestionStore } from "../store/question";
import { QuizModalProps } from "../types/quiz";
import Button from "./Button";

const QuizModal = ({ isVisible, onClose }: QuizModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const { questions, setSelectedAnswers: saveAnswers } = useQuestionStore();

  const { setBeaches } = useBeachStore();

  const translateY = new Animated.Value(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setSelectedAnswers([]);
      setCurrentStep(0);
    }
  }, [isVisible]);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setIsDragging(true);
    } else if (event.nativeEvent.state === State.END) {
      setIsDragging(false);
      const { translationY } = event.nativeEvent;

      if (translationY > 50) {
        onClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
      translateY.setValue(0);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentStep] = answer;
    setSelectedAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmitQuestions = async () => {
    try {
      saveAnswers(selectedAnswers);

      const beaches = await findBeaches(selectedAnswers);
      setBeaches(beaches);

      setSelectedAnswers([]);
      setCurrentStep(0);
      onClose();

      router.push("/result");
    } catch (error) {
      throw error;
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <Modal isVisible={isVisible} onBackdropPress={onClose}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Nenhuma pergunta disponível.</Text>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
      swipeDirection={["down"]}
      onSwipeComplete={onClose}
      swipeThreshold={50}
      testID="modal"
    >
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetY={[-10, 10]}
        enabled={!isDragging}
        testID="pan-gesture-handler"
      >
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: translateY }] },
          ]}
        >
          <View style={styles.dragHandle} />
          <View style={styles.quizContainer}>
            <Text style={styles.quizTitle}>
              Pergunta {currentStep + 1} de {questions.length}
            </Text>

            <View style={styles.stepperContainer}>
              {questions.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.stepDot,
                    index === currentStep && styles.activeStepDot,
                    index < currentStep && styles.completedStepDot,
                  ]}
                />
              ))}
            </View>

            <View style={styles.answerContainer}>
              <Text style={styles.questionTitle}>
                {questions[currentStep]?.question || "Pergunta não encontrada"}
              </Text>

              {questions[currentStep]?.options.map((option, index) => (
                <Button
                  onPress={() => handleAnswerSelect(option)}
                  key={index}
                  style={[
                    styles.answers,
                    selectedAnswers[currentStep] === option &&
                      styles.selectedAnswer,
                  ]}
                >
                  <View style={styles.answerNumber}>
                    <Text style={styles.numberLabel}>{index + 1}</Text>
                  </View>
                  <Text style={styles.answerLabel}>{option}</Text>
                  <View></View>
                </Button>
              ))}

              <View style={styles.navigationButtons}>
                {currentStep > 0 && (
                  <Button onPress={handleBack} style={styles.backButton}>
                    <Text style={styles.navigationButtonText}>Voltar</Text>
                  </Button>
                )}

                <Button
                  onPress={() => {
                    if (currentStep === questions.length - 1) {
                      handleSubmitQuestions();
                    } else if (selectedAnswers[currentStep]) {
                      setCurrentStep(currentStep + 1);
                    }
                  }}
                  disabled={selectedAnswers.length !== questions.length}
                  style={styles.nextButton}
                >
                  <Text style={styles.navigationButtonText}>
                    {currentStep === questions.length - 1
                      ? "Finalizar"
                      : "Continuar"}
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: colours.secondaryBackground,
    padding: 22,
    height: "80%",
    flexDirection: "column",
    width: "100%",
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: colours.grey,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 15,
  },
  quizContainer: {
    borderRadius: 8,
    padding: 16,
    flex: 1,
  },
  quizTitle: {
    ...fontStyles.title34,
    color: colours.primary,
    textAlign: "center",
  },
  questionTitle: {
    ...fontStyles.title,
    color: colours.black,
    textAlign: "center",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: colours.secondary,
  },
  answerContainer: {
    borderRadius: 8,
    justifyContent: "space-around",
    flex: 1,
  },
  answers: {
    backgroundColor: colours.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    minWidth: 100,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  answerNumber: {
    backgroundColor: colours.lightGrey,
    borderRadius: 50,
    width: 30,
    height: 30,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  numberLabel: {
    ...fontStyles.bold18,
  },
  answerLabel: {
    ...fontStyles.medium22,
    textTransform: "uppercase",
    color: colours.black,
    minWidth: 220,
    textAlign: "center",
  },
  stepperContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colours.grey500,
    marginHorizontal: 5,
  },
  activeStepDot: {
    backgroundColor: colours.secondary,
    width: 16,
  },
  completedStepDot: {
    backgroundColor: colours.primary,
  },
  selectedAnswer: {
    borderWidth: 2,
    borderColor: colours.secondary,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
    borderColor: colours.primary,
    backgroundColor: colours.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: colours.secondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  navigationButtonText: {
    ...fontStyles.bodyBold,
    color: colours.white,
    textTransform: "uppercase",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default QuizModal;
