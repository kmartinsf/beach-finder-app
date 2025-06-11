import QuizModal from "@/components/QuizModal";
import { fireEvent, render } from "@testing-library/react-native";
import { State } from "react-native-gesture-handler";

describe("QuizModal", () => {
  it("should render the first question", () => {
    const { getByText } = render(
      <QuizModal isVisible={true} onClose={() => {}} />
    );
    expect(getByText("Pergunta 1 de 2")).toBeTruthy();
    expect(getByText("Resposta 1")).toBeTruthy();
    expect(getByText("Resposta 2")).toBeTruthy();
    expect(getByText("Resposta 3")).toBeTruthy();
  });

  it("should navigate to next question after selecting an answer", () => {
    const { getByText } = render(
      <QuizModal isVisible={true} onClose={() => {}} />
    );
    fireEvent.press(getByText("Resposta 1"));

    expect(getByText("Pergunta 2 de 2")).toBeTruthy();
  });

  it("should allow going back to previous question", () => {
    const { getByText } = render(
      <QuizModal isVisible={true} onClose={() => {}} />
    );

    fireEvent.press(getByText("Resposta 1"));

    fireEvent.press(getByText("Voltar"));

    expect(getByText("Pergunta 1 de 2")).toBeTruthy();
  });

  it("should show finish button on last question", () => {
    const { getByText } = render(
      <QuizModal isVisible={true} onClose={() => {}} />
    );

    fireEvent.press(getByText("Resposta 1"));

    expect(getByText("Finalizar")).toBeTruthy();
  });

  it("should close modal when swiping down", () => {
    const onClose = jest.fn();
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
