import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-rose-400 to-love-700 text-white shadow-lg shadow-rose-300/30 hover:shadow-rose-400/40 hover:brightness-105 active:scale-[0.98]",
        outline:
          "border-2 border-rose-300 bg-white/60 text-love-700 hover:bg-rose-50 hover:border-rose-400 backdrop-blur-sm",
        ghost:
          "text-love-700 hover:bg-rose-50/80 hover:text-love-700",
        muted:
          "bg-gradient-to-r from-white to-rose-50 text-love-900 border border-rose-200/60 hover:border-rose-300 shadow-sm",
        gradient:
          "bg-gradient-to-br from-rose-400 via-pink-500 to-love-700 text-white shadow-xl shadow-rose-400/35 hover:shadow-rose-500/50 hover:scale-[1.02] active:scale-[0.98]",
        link: "text-rose-500 underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
