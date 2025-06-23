import FavouritesScreen from "@/app/(tabs)/favourites";
import { fireEvent, render } from "@testing-library/react-native";

jest.mock("@/store/beaches", () => ({
  useBeachStore: () => ({
    favouriteBeaches: [
      { id: "1", name: "Praia do Campeche" },
      { id: "2", name: "Praia Mole" },
    ],
  }),
}));

describe("FavouritesScreen", () => {
  it("should render the title", () => {
    const { getByText } = render(<FavouritesScreen />);
    expect(getByText("Confira as praias que você mais ama!")).toBeTruthy();
  });

  it("should display favourite beaches", () => {
    const { getByText } = render(<FavouritesScreen />);
    expect(getByText("Praia do Campeche")).toBeTruthy();
    expect(getByText("Praia Mole")).toBeTruthy();
  });

  it("should navigate to beach details on press", () => {
    const { getByText } = render(<FavouritesScreen />);
    fireEvent.press(getByText("Praia do Campeche"));
    expect(getByText("Confira as praias que você mais ama!")).toBeTruthy();
  });
});
