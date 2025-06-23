jest.mock("@/store/question", () => ({
  useQuestionStore: jest.fn(),
}));

jest.mock("@/utils/firebase", () => ({
  findBeaches: jest.fn().mockResolvedValue([]),
}));

import QuizModal from "@/components/QuizModal";
import { fireEvent, render } from "@testing-library/react-native";
import { State } from "react-native-gesture-handler";

import { useQuestionStore } from "@/store/question";

const mockUseQuestionStore = useQuestionStore as unknown as jest.Mock;

describe("QuizModal", () => {
  beforeEach(() => {
    mockUseQuestionStore.mockReset();
  });

  it("should render the first question", () => {
    mockUseQuestionStore.mockReturnValue({
      questions: [
        {
          question: "Pergunta 1",
          options: ["Resposta 1", "Resposta 2", "Resposta 3"],
        },
        {
          question: "Pergunta 2",
          options: ["Resposta A", "Resposta B", "Resposta C"],
        },
      ],
      currentStep: 0,
      setAnswer: jest.fn(),
      goNext: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
    });

    const { getByText } = render(
      <QuizModal isVisible={true} onClose={() => {}} />
    );

    expect(getByText("Pergunta 1 de 2")).toBeTruthy();
    expect(getByText("Resposta 1")).toBeTruthy();
    expect(getByText("Resposta 2")).toBeTruthy();
    expect(getByText("Resposta 3")).toBeTruthy();
  });

  it("should show finish button on last question", () => {
    mockUseQuestionStore.mockReturnValue({
      questions: [
        {
          question: "Pergunta 1",
          options: ["Resposta 1", "Resposta 2"],
        },
        {
          question: "Pergunta 2",
          options: ["Resposta A", "Resposta B"],
        },
      ],
      currentStep: 0,
      setAnswer: jest.fn(),
      goNext: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
      setSelectedAnswers: jest.fn(),
    });

    const { getByText, queryByText } = render(
      <QuizModal isVisible={true} onClose={() => {}} />
    );

    fireEvent.press(getByText("Resposta 1"));
    fireEvent.press(getByText("Resposta A"));

    expect(getByText("Finalizar")).toBeTruthy();
    expect(queryByText("Continuar")).toBeNull();
  });

  it("should close modal when swiping down", () => {
    const onClose = jest.fn();

    mockUseQuestionStore.mockReturnValue({
      questions: [
        {
          question: "Pergunta 1",
          options: ["Resposta 1", "Resposta 2"],
        },
      ],
      currentStep: 0,
      setAnswer: jest.fn(),
      goNext: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
    });

    const { getByTestId } = render(
      <QuizModal isVisible={true} onClose={onClose} />
    );

    const panGestureHandler = getByTestId("pan-gesture-handler");

    fireEvent(panGestureHandler, "onGestureEvent", {
      nativeEvent: { translationY: 0 },
    });

    fireEvent(panGestureHandler, "onHandlerStateChange", {
      nativeEvent: { state: State.BEGAN },
    });

    fireEvent(panGestureHandler, "onGestureEvent", {
      nativeEvent: { translationY: 100 },
    });

    fireEvent(panGestureHandler, "onHandlerStateChange", {
      nativeEvent: { state: State.END, translationY: 100 },
    });

    expect(onClose).toHaveBeenCalled();
  });
});
