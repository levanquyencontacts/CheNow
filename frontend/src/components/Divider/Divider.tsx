import * as React from "react";
import { clsx } from "../utils";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Divider({ children, className, ...props }: DividerProps) {
  if (children) {
    return (
      <div
        className={clsx(
          "flex items-center gap-4 text-xs uppercase text-[#a29587]",
          className
        )}
        {...props}
      >
        <span className="h-px flex-1 bg-[#e7dbcf]" />
        {children}
        <span className="h-px flex-1 bg-[#e7dbcf]" />
      </div>
    );
  }

  return <div className={clsx("h-px bg-[#eee4db]", className)} {...props} />;
}
