jest.setTimeout(20000); // ⏱ aumenta timeout global para evitar falhas

import ResultScreen from "@/app/result";
import { useBeachStore } from "@/store/beaches";
import { useQuestionStore } from "@/store/question";
import { NavigationContainer } from "@react-navigation/native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { act } from "react-test-renderer";

const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

jest.mock("@/store/beaches", () => ({
  useBeachStore: jest.fn(),
}));

jest.mock("@/store/question", () => ({
  useQuestionStore: jest.fn(),
}));

jest.mock("@/components/Loader", () => {
  return () => {
    const { Text } = require("react-native");
    return <Text>Loading...</Text>;
  };
});

jest.mock("@/components/QuizModal", () => {
  return ({ isVisible }: { isVisible: boolean }) => {
    const { Text } = require("react-native");
    return isVisible ? <Text>Modal Aberto</Text> : null;
  };
});

jest.mock("@/components/UniqueBeach", () => {
  return ({ children, onPress }: any) => {
    const { Text } = require("react-native");
    return (
      <Text onPress={onPress} testID="unique-beach">
        {children}
      </Text>
    );
  };
});

describe("ResultScreen", () => {
  const mockSetSelectedAnswers = jest.fn();

  const renderWithNavigation = (component: React.ReactElement) => {
    return render(<NavigationContainer>{component}</NavigationContainer>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({ legacyFakeTimers: true }); // importante!
    (useQuestionStore as unknown as jest.Mock).mockReturnValue({
      setSelectedAnswers: mockSetSelectedAnswers,
    });
  });

  it("should show loader when loading", () => {
    (useBeachStore as unknown as jest.Mock).mockReturnValue({
      beaches: [{ name: "Jurerê", id: "1" }],
    });

    const { getByText } = renderWithNavigation(<ResultScreen />);
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("should show empty state when no beaches are found", async () => {
    (useBeachStore as unknown as jest.Mock).mockReturnValue({ beaches: [] });

    const { getByText } = renderWithNavigation(<ResultScreen />);

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(getByText("Nenhuma praia encontrada!")).toBeTruthy();
      expect(getByText("Refazer")).toBeTruthy();
    });
  });

  it("should render beaches and navigate on press", async () => {
    const beaches = [
      { name: "Lagoinha", id: "abc", waves: false, waterTemp: "warm" },
    ];
    (useBeachStore as unknown as jest.Mock).mockReturnValue({ beaches });

    const { getByText, getByTestId } = renderWithNavigation(<ResultScreen />);

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(getByText("Que tal:")).toBeTruthy();
    });

    fireEvent.press(getByTestId("unique-beach"));

    expect(mockNavigate).toHaveBeenCalledWith(
      "beach_details",
      expect.objectContaining({ beachId: expect.any(String) })
    );
  });

  it("should display random beach when button is clicked", async () => {
    const beaches = [
      { name: "Canasvieiras", id: "1", waves: false, waterTemp: "warm" },
      { name: "Ingleses", id: "2", waves: true, waterTemp: "cold" },
    ];

    (useBeachStore as unknown as jest.Mock).mockReturnValue({ beaches });

    const { getByText } = renderWithNavigation(<ResultScreen />);

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(getByText("Sorteie uma praia")).toBeTruthy();
    });

    fireEvent.press(getByText("Sorteie uma praia"));

    await waitFor(() => {
      expect(
        getByText("Canasvieiras").props.children ||
        getByText("Ingleses").props.children
      ).toBeTruthy();
    });
  });
});
