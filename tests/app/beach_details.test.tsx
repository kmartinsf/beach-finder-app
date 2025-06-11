import BeachDetails from "@/app/beach_details";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import type { Text } from "react-native";

jest.mock("@expo/vector-icons", () => ({
  FontAwesome: (props: React.ComponentProps<typeof Text>) => {
    const { Text } = require("react-native");
    return <Text {...props}>❤️</Text>;
  },
}));

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const mockUseBeachStore = jest.fn();
jest.mock("@/store/beaches", () => ({
  useBeachStore: () => mockUseBeachStore(),
}));

describe("BeachDetails", () => {
  const mockBeach = {
    id: "1",
    name: "Daniela",
    region: "north",
    waterTemp: "warm",
    waves: false,
    description: "A beautiful test beach",
  };

  const mockToggleFavourite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useLocalSearchParams as jest.Mock).mockReturnValue({ beachId: "1" });
    mockUseBeachStore.mockReturnValue({
      beaches: [mockBeach],
      favouriteBeaches: [],
      toggleFavouriteBeach: mockToggleFavourite,
    });
  });

  it("should render beach details correctly", () => {
    render(<BeachDetails />);

    expect(screen.getByText("Daniela")).toBeTruthy();
    expect(screen.getByText("Região: Norte")).toBeTruthy();
    expect(screen.getByText("Temperatura da Água: Quente")).toBeTruthy();
    expect(screen.getByText("Mar: Calmo")).toBeTruthy();
  });

  it("should show error message when beach is not found", () => {
    mockUseBeachStore.mockReturnValue({
      beaches: [],
      favouriteBeaches: [],
      toggleFavouriteBeach: mockToggleFavourite,
    });

    render(<BeachDetails />);
    expect(screen.getByText("Praia não encontrada")).toBeTruthy();
  });

  it("should handle favourite toggle correctly", () => {
    render(<BeachDetails />);
    const heartIcon = screen.getByTestId("heart-icon");

    fireEvent.press(heartIcon);
    expect(mockToggleFavourite).toHaveBeenCalledWith(mockBeach);
  });

  it("should display correct favourite status", () => {
    mockUseBeachStore.mockReturnValue({
      beaches: [mockBeach],
      favouriteBeaches: [mockBeach],
      toggleFavouriteBeach: mockToggleFavourite,
    });

    render(<BeachDetails />);
    const heartIcon = screen.getByTestId("heart-icon");

    expect(heartIcon.props.color).toBe("#D2042D");
  });

  it("should format region and water temperature correctly", () => {
    render(<BeachDetails />);

    expect(screen.getByText("Região: Norte")).toBeTruthy();
    expect(screen.getByText("Temperatura da Água: Quente")).toBeTruthy();
  });
});
