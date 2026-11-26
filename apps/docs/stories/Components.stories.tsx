import type { Meta, StoryObj } from "@storybook/react";
import { Button, Input, Modal } from "@acme/ui-core";

const meta = {
  title: "Foundations/Components",
  parameters: { layout: "centered" }
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Buttons: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button as="a" href="#input" variant="ghost">Link button</Button>
    </div>
  )
};

export const FormField: Story = {
  render: () => <div style={{ width: 320 }}>
    <Input label="Email address" hint="Use your work email." placeholder="name@example.com" />
  </div>
};

export const AccessibleModal: Story = {
  render: () => (
    <Modal.Root defaultOpen>
      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content>
            <Modal.Title>Delete project?</Modal.Title>
            <Modal.Description>This action cannot be undone.</Modal.Description>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <Modal.Close className="ds-button ds-button--secondary ds-button--md">Cancel</Modal.Close>
              <Modal.Close className="ds-button ds-button--danger ds-button--md">Delete project</Modal.Close>
            </div>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal.Root>
  )
};
