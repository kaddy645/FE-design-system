import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

it("renders as a link when requested while preserving its link props", () => {
  render(<Button as="a" href="/docs">Documentation</Button>);
  expect(screen.getByRole("link", { name: "Documentation" })).toHaveAttribute("href", "/docs");
});
