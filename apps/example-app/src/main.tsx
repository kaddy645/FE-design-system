import React from "react";
import ReactDOM from "react-dom/client";
import { Button, Input, Modal } from "@acme/ui-core";
import "@acme/ui-core/tokens.css";
import "./styles.css";

function App() {
  return (
    <main className="demo" data-brand="default">
      <span className="demo__eyebrow text-brand-600">ACME COMPONENT PLAYGROUND</span>
      <h1>Design system starter</h1>
      <p>Consuming the shared component package from a separate workspace app.</p>
      <div className="demo__controls">
        <Button>Save changes</Button>
        <Button as="a" href="https://storybook.js.org/" variant="secondary">Documentation</Button>
      </div>
      <div className="demo__field">
        <Input label="Workspace name" defaultValue="Acme Design" hint="Visible to your team." />
      </div>
      <Modal.Root>
        <Modal.Trigger className="ds-button ds-button--ghost ds-button--md">Open accessible dialog</Modal.Trigger>
        <Modal.Portal>
          <Modal.Overlay>
            <Modal.Content>
              <Modal.Title>Invite your team</Modal.Title>
              <Modal.Description>Share the design system with your colleagues.</Modal.Description>
              <Input label="Email address" type="email" placeholder="colleague@example.com" />
              <div className="demo__actions">
                <Modal.Close className="ds-button ds-button--secondary ds-button--md">Cancel</Modal.Close>
                <Modal.Close className="ds-button ds-button--primary ds-button--md">Send invite</Modal.Close>
              </div>
            </Modal.Content>
          </Modal.Overlay>
        </Modal.Portal>
      </Modal.Root>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
