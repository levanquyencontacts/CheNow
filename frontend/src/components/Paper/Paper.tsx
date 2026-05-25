import * as React from "react";
import { clsx } from "../utils";

export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 0 | 1 | 2 | 3;
  square?: boolean;
}

export const Paper = React.forwardRef<HTMLDivElement, PaperProps>(
  ({ className, elevation = 1, square = false, ...props }, ref) => {
    const shadows = {
      0: "",
      1: "shadow-[0_2px_8px_rgba(83,61,39,0.03)]",
      2: "shadow-[0_12px_32px_rgba(63,39,21,0.12)]",
      3: "shadow-[0_18px_50px_rgba(63,39,21,0.18)]",
    };

    return (
      <div
        className={clsx(
          "bg-white",
          !square && "rounded-lg",
          shadows[elevation],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Paper.displayName = "Paper";
