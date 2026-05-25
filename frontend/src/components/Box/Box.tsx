import * as React from "react";
import { clsx } from "../utils";

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  component?: React.ElementType;
}

export const Box = React.forwardRef<HTMLElement, BoxProps>(
  ({ component: Component = "div", className, ...props }, ref) => (
    <Component className={clsx(className)} ref={ref} {...props} />
  )
);

Box.displayName = "Box";
