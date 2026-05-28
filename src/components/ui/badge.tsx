import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-rose-200/50 bg-gradient-to-r from-rose-100 to-pink-100 text-love-700",
        outline:
          "border-rose-300 bg-transparent text-rose-600",
        gradient:
          "border-transparent bg-gradient-to-r from-rose-400 to-love-700 text-white shadow-sm shadow-rose-300/40",
        subtle:
          "border-rose-100 bg-rose-50/80 text-rose-600",
        new:
          "border-transparent bg-gradient-to-r from-pink-500 to-love-700 text-white text-[0.65rem] px-2 py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
