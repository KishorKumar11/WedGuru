import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border border-rose-200/60 bg-white/70 px-4 py-3 text-sm text-love-900 placeholder:text-rose-300 backdrop-blur-sm transition-all duration-200 resize-y",
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
Textarea.displayName = "Textarea";

export { Textarea };
