import { render, screen } from "@testing-library/react";
import { Input } from "./Input";

it("connects label, hint, and error state accessibly", () => {
  render(<Input label="Email address" hint="Work email preferred" error="Enter a valid email" />);
  const input = screen.getByRole("textbox", { name: "Email address" });
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input).toHaveAccessibleDescription("Work email preferred Enter a valid email");
});
