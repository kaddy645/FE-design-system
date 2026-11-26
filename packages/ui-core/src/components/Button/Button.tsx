import * as React from "react";
import "./button.css";

type PropsOf<C extends React.ElementType> = React.ComponentPropsWithoutRef<C>;

export type ButtonProps<C extends React.ElementType = "button"> = {
  as?: C;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
} & Omit<PropsOf<C>, "as" | "className">;

export function Button<C extends React.ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps<C>) {
  const Component = as ?? "button";
  const classes = ["ds-button", `ds-button--${variant}`, `ds-button--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Component
      className={classes}
      {...(Component === "button" ? { type: "button" } : {})}
      {...props}
    />
  );
}
