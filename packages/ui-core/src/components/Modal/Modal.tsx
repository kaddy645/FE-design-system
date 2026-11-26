import * as React from "react";
import { createPortal } from "react-dom";
import "./modal.css";

interface ModalContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
  contentId: string;
}

const ModalContext = React.createContext<ModalContextValue | null>(null);
const subscribeToPortalContainer = () => () => {};
const getPortalContainer = () => (typeof document === "undefined" ? null : document.body);
const getServerPortalContainer = () => null;

function useModalContext(component: string): ModalContextValue {
  const context = React.useContext(ModalContext);
  if (!context) throw new Error(`Modal.${component} must be rendered inside <Modal.Root>.`);
  return context;
}

interface RootProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Root({ children, open: controlledOpen, defaultOpen = false, onOpenChange }: RootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = React.useCallback((next: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }, [controlledOpen, onOpenChange]);
  const titleId = React.useId();
  const descriptionId = React.useId();
  const contentId = React.useId();

  return (
    <ModalContext.Provider value={{ open, setOpen, titleId, descriptionId, contentId }}>
      {children}
    </ModalContext.Provider>
  );
}

type TriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
function Trigger(props: TriggerProps) {
  const { open, setOpen, contentId } = useModalContext("Trigger");
  return <button
    {...props}
    type={props.type ?? "button"}
    aria-haspopup="dialog"
    aria-expanded={open}
    aria-controls={open ? contentId : undefined}
    onClick={(event) => {
    props.onClick?.(event);
    if (!event.defaultPrevented) setOpen(true);
    }}
  />;
}

function Portal({ children }: { children: React.ReactNode }) {
  const { open } = useModalContext("Portal");
  const container = React.useSyncExternalStore(
    subscribeToPortalContainer,
    getPortalContainer,
    getServerPortalContainer
  );
  return open && container ? createPortal(children, container) : null;
}

function Overlay({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { setOpen } = useModalContext("Overlay");
  return <div
    {...props}
    className={["ds-modal__overlay", className].filter(Boolean).join(" ")}
    onMouseDown={(event) => {
      props.onMouseDown?.(event);
      if (!event.defaultPrevented && event.target === event.currentTarget) setOpen(false);
    }}
  />;
}

type FocusableElement = HTMLElement & { disabled?: boolean };
const FOCUSABLE_SELECTOR = [
  "a[href]", "area[href]", "button:not([disabled])", "input:not([disabled])",
  "select:not([disabled])", "textarea:not([disabled])", "iframe", "object", "embed",
  "[contenteditable='true']", "[tabindex]:not([tabindex='-1'])"
].join(",");

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
}

function Content({ className = "", children, onEscapeKeyDown, ...props }: ContentProps) {
  const { setOpen, titleId, descriptionId, contentId } = useModalContext("Content");
  const contentRef = React.useRef<HTMLDivElement>(null);
  const onEscapeRef = React.useRef(onEscapeKeyDown);

  React.useEffect(() => {
    onEscapeRef.current = onEscapeKeyDown;
  }, [onEscapeKeyDown]);

  React.useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const getFocusable = (): FocusableElement[] =>
      Array.from(content.querySelectorAll<FocusableElement>(FOCUSABLE_SELECTOR))
        .filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");

    (getFocusable()[0] ?? content).focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscapeRef.current?.(event);
        if (!event.defaultPrevented) {
          event.preventDefault();
          setOpen(false);
        }
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        content.focus();
      } else if (event.shiftKey && (
        document.activeElement === focusable[0] ||
        document.activeElement === content ||
        !content.contains(document.activeElement)
      )) {
        event.preventDefault();
        focusable[focusable.length - 1]?.focus();
      } else if (!event.shiftKey && (document.activeElement === focusable[focusable.length - 1] || !content.contains(document.activeElement))) {
        event.preventDefault();
        focusable[0]?.focus();
      }
    };

    const onFocusIn = (event: FocusEvent) => {
      if (event.target instanceof Node && !content.contains(event.target)) {
        (getFocusable()[0] ?? content).focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
      previouslyFocused?.focus();
    };
  }, [setOpen]);

  return (
    <div
      {...props}
      ref={contentRef}
      id={props.id ?? contentId}
      className={["ds-modal__content", className].filter(Boolean).join(" ")}
      role="dialog"
      aria-modal="true"
      aria-labelledby={props["aria-labelledby"] ?? titleId}
      aria-describedby={props["aria-describedby"] ?? descriptionId}
      tabIndex={-1}
    >
      {children}
    </div>
  );
}

function Title(props: React.HTMLAttributes<HTMLHeadingElement>) {
  const { titleId } = useModalContext("Title");
  return <h2 {...props} id={props.id ?? titleId} className={["ds-modal__title", props.className].filter(Boolean).join(" ")} />;
}

function Description(props: React.HTMLAttributes<HTMLParagraphElement>) {
  const { descriptionId } = useModalContext("Description");
  return <p {...props} id={props.id ?? descriptionId} className={["ds-modal__description", props.className].filter(Boolean).join(" ")} />;
}

function Close(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useModalContext("Close");
  return <button {...props} type={props.type ?? "button"} onClick={(event) => {
    props.onClick?.(event);
    if (!event.defaultPrevented) setOpen(false);
  }} />;
}

export const Modal = {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Title,
  Description,
  Close
};
