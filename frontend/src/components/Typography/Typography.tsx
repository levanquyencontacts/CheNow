import * as React from "react";
import { clsx } from "../utils";

type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "body1"
  | "body2"
  | "caption";

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement> {
  component?: React.ElementType;
  variant?: TypographyVariant;
}

const defaultElements: Record<TypographyVariant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  body1: "p",
  body2: "p",
  caption: "span",
};

const variants: Record<TypographyVariant, string> = {
  h1: "text-4xl font-semibold leading-tight",
  h2: "text-3xl font-medium leading-tight",
  h3: "text-xl font-semibold",
  body1: "text-sm leading-7",
  body2: "text-sm leading-6",
  caption: "text-xs leading-5",
};

export function Typography({
  component,
  variant = "body1",
  className,
  ...props
}: TypographyProps) {
  const Component = component || defaultElements[variant];

  return (
    <Component className={clsx(variants[variant], className)} {...props} />
  );
}
