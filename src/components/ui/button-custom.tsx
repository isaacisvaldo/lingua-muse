import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent text-primary-foreground hover:bg-primary/90",
        hero: "btn-primary rounded-xl px-6 py-3 font-semibold",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
        ghost: "btn-ghost",
        icon: "btn-icon",
        favorite: "btn-icon text-muted-foreground hover:text-warning data-[favorited=true]:text-warning",
        copy: "btn-icon text-muted-foreground hover:text-accent",
        share: "btn-icon text-muted-foreground hover:text-primary",
        audio: "btn-icon text-muted-foreground hover:text-primary border border-border hover:border-primary",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };