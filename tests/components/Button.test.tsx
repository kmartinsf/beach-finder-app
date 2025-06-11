import Button from "@/components/Button";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

describe("Button", () => {
  it("should render and respond to press", () => {
    const onPressMock = jest.fn();

    const { getByText } = render(
      <Button onPress={onPressMock}>
        <Text>Test</Text>
      </Button>
    );

    fireEvent.press(getByText("Test"));

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it("should contain a children", () => {
    const { getByText } = render(
      <Button onPress={() => {}}>
        <Text>Test</Text>
      </Button>
    );

    expect(getByText("Test")).toBeOnTheScreen();
    expect(getByText("Test")).toBeTruthy();
  });
});
