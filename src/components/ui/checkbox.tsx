"use client";

import { forwardRef } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, indeterminate, disabled, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          disabled={disabled}
          aria-checked={indeterminate ? "mixed" : checked}
          className={cn(
            "peer h-4 w-4 appearance-none rounded-sm border border-border bg-card",
            "checked:bg-aurora-2 checked:border-aurora-2 checked:text-white",
            "indeterminate:bg-aurora-2 indeterminate:border-aurora-2 indeterminate:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurora-2/50 focus-visible:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors duration-150",
            className
          )}
          {...props}
        />
        {checked && (
          <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-3 text-white pointer-events-none" strokeWidth={3} />
        )}
        {indeterminate && !checked && (
          <Minus className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-3 text-white pointer-events-none" strokeWidth={3} />
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";