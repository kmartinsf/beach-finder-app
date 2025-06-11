import Loader from "@/components/Loader";
import { render } from "@testing-library/react-native";
import React from "react";

describe("Loader", () => {
  it("should render loader when loading is true", () => {
    const { getByTestId } = render(<Loader loading={true} />);
    expect(getByTestId("activity-indicator")).toBeTruthy();
  });

  it("should not render loader when loading is false", () => {
    const { queryByTestId } = render(<Loader loading={false} />);
    expect(queryByTestId("activity-indicator")).toBeNull();
  });
});
