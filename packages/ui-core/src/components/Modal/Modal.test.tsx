import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

function TestModal() {
  return (
    <Modal.Root>
      <Modal.Trigger>Open dialog</Modal.Trigger>
      <Modal.Portal>
        <Modal.Overlay data-testid="overlay">
          <Modal.Content>
            <Modal.Title>Account settings</Modal.Title>
            <Modal.Description>Update your account preferences.</Modal.Description>
            <button type="button">First action</button>
            <Modal.Close>Close dialog</Modal.Close>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal.Root>
  );
}

describe("Modal", () => {
  it("portals a labeled dialog, traps focus, dismisses on Escape, and restores focus", async () => {
    const user = userEvent.setup();
    render(<TestModal />);
    const trigger = screen.getByRole("button", { name: "Open dialog" });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "Account settings" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(dialog).toHaveAttribute("aria-describedby");
    expect(screen.getByText("Update your account preferences.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "First action" })).toHaveFocus();

    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(screen.getByRole("button", { name: "Close dialog" })).toHaveFocus();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("closes when the backdrop itself is clicked", async () => {
    const user = userEvent.setup();
    render(<TestModal />);
    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    await user.click(await screen.findByTestId("overlay"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
