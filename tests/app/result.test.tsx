jest.setTimeout(20000);

import ResultScreen from "@/app/result";
import { useBeachStore } from "@/store/beaches";
import { useQuestionStore } from "@/store/question";
import { NavigationContainer } from "@react-navigation/native";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

const mockNavigate = jest.fn();
const mockSetSelectedAnswers = jest.fn();
const mockUseQuestionStore = jest.fn();
const mockUseBeachStore = jest.fn();

jest.mock("@/store/question", () => ({
  useQuestionStore: () => mockUseQuestionStore(),
}));

jest.mock("@/store/beaches", () => ({
  useBeachStore: () => mockUseBeachStore(),
}));

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
    useFocusEffect: jest.fn((cb) => cb()),
  };
});

describe("ResultScreen", () => {
  const renderWithNavigation = (component: React.ReactElement) => {
    return render(<NavigationContainer>{component}</NavigationContainer>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({ legacyFakeTimers: true });
    mockUseQuestionStore.mockReturnValue({
      setSelectedAnswers: mockSetSelectedAnswers,
    });
  });

  it("should show loader when loading", () => {
    mockUseBeachStore.mockReturnValue({
      beaches: [{ name: "Jurerê", id: "1" }],
    });

    const { getByTestId } = renderWithNavigation(<ResultScreen />);
    expect(getByTestId("activity-indicator")).toBeTruthy();
  });

  it("should show empty state when no beaches are found", async () => {
    mockUseBeachStore.mockReturnValue({ beaches: [] });

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
      { name: "Lagoinha", id: "1", waves: false, waterTemp: "warm" },
    ];
    mockUseBeachStore.mockReturnValue({ beaches });

    const { getByText, getByTestId } = renderWithNavigation(<ResultScreen />);

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(getByText("Que tal:")).toBeTruthy();
    });

    fireEvent.press(getByTestId("unique-beach"));

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      "beach_details",
      expect.objectContaining({ beachId: "1" })
    );
  });

  it("should display random beach when button is clicked", async () => {
    const beaches = [
      { name: "Canasvieiras", id: "1", waves: false, waterTemp: "warm" },
      { name: "Ingleses", id: "2", waves: true, waterTemp: "cold" },
    ];

    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.75;
    global.Math = mockMath;

    mockUseBeachStore.mockReturnValue({ beaches });

    const { getByText } = renderWithNavigation(<ResultScreen />);

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    fireEvent.press(getByText("Sorteie uma praia"));

    await waitFor(() => {
      expect(getByText("Ingleses")).toBeTruthy();
    });
  });
});
