import * as React from "react";
import { clsx } from "../utils";

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  component?: React.ElementType;
}

export const Box = React.forwardRef<HTMLElement, BoxProps>(
  ({ component = "div", className, ...props }, ref) =>
    React.createElement(component, {
      ...props,
      className: clsx(className),
      ref,
    }),
);

Box.displayName = "Box";
