import HomeScreen from "@/app/(tabs)";
import { NavigationContainer } from "@react-navigation/native";
import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

jest.mock("@react-navigation/native-stack", () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Screen: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }),
}));

describe("HomeScreen", () => {
  const renderWithNavigation = (component: React.ReactElement) => {
    return render(<NavigationContainer>{component}</NavigationContainer>);
  };

  it("should render the title", () => {
    renderWithNavigation(<HomeScreen />);
    expect(screen.getByText("Encontre uma praia para hoje")).toBeOnTheScreen();
  });

  it("should show button to start quiz", () => {
    renderWithNavigation(<HomeScreen />);
    const button = screen.getByText("Começar");
    expect(button).toBeOnTheScreen();
  });

  it("should show quiz modal when button is pressed", () => {
  renderWithNavigation(<HomeScreen />);
  const button = screen.getByText("Começar");
  fireEvent.press(button);
  
  expect(screen.getByText("Pergunta 1")).toBeOnTheScreen();
});
});