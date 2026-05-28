import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-rose-200/60 bg-white/70 px-4 py-2.5 text-sm text-love-900 placeholder:text-rose-300 backdrop-blur-sm transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-rose-300/60 focus:border-rose-400 focus:bg-white/90",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
