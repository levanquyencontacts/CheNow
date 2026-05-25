import * as React from "react";
import { clsx } from "../utils";

export const Form = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) => (
  <form className={clsx(className)} ref={ref} {...props} />
));

Form.displayName = "Form";
