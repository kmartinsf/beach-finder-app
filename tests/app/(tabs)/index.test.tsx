import HomeScreen from "@/app/(tabs)";
import { fireEvent, render, screen } from "@testing-library/react-native";

// Mock the navigation container to avoid native dependencies
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  NavigationContainer: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock the native stack navigator
jest.mock("@react-navigation/native-stack", () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Screen: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }),
}));

describe("HomeScreen", () => {
  it("should show button to start quiz", () => {
    render(<HomeScreen />);
    const button = screen.getByText("Começar");
    expect(button).toBeOnTheScreen();
  });

  it("should show quiz modal when button is pressed", () => {
    render(<HomeScreen />);
    const button = screen.getByText("Começar");
    fireEvent.press(button);
    expect(screen.getByText("Quiz")).toBeOnTheScreen();
  });
});
