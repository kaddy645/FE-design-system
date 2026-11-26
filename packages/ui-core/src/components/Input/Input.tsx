import * as React from "react";
import "./input.css";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ id: providedId, label, error, hint, className = "", ...props }, ref) => {
    const generatedId = React.useId();
    const id = providedId ?? generatedId;
    const hintId = hint ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [props["aria-describedby"], hintId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="ds-field">
        <label className="ds-field__label" htmlFor={id}>{label}</label>
        <input
          {...props}
          ref={ref}
          id={id}
          className={["ds-input", error ? "ds-input--invalid" : "", className].filter(Boolean).join(" ")}
          aria-invalid={error ? true : props["aria-invalid"]}
          aria-describedby={describedBy}
        />
        {hint && <div className="ds-field__hint" id={hintId}>{hint}</div>}
        {error && <div className="ds-field__error" id={errorId}>{error}</div>}
      </div>
    );
  }
);
Input.displayName = "Input";
