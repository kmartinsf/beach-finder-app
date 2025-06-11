import Button from "@/components/Button";
import UniqueBeach from "@/components/UniqueBeach";
import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";

describe("UniqueBeach", () => {
  it("should render a unique beach", () => {
    const { getByText } = render(
      <UniqueBeach onPress={() => {}}>
        <Text>Daniela</Text>
      </UniqueBeach>
    );
    expect(getByText("Daniela")).toBeTruthy();
  });

  it("should render and respond to press", () => {
    const onPressMock = jest.fn();

    const { getByText } = render(
      <Button onPress={onPressMock}>
        <Text>Daniela</Text>
      </Button>
    );

    fireEvent.press(getByText("Daniela"));

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
