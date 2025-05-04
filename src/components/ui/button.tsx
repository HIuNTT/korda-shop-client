import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Spinner } from "./spinner"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[2px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive [&:has(>div>i)>div]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/80",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-sm text-xs gap-1.5 px-3 has-[>svg]:px-2.5 has-[_i]:px-2.5",
        md: "h-10 px-4 has-[>svg]:px-4 has-[_i]:px-4 [&_svg:not([class*='size-'])]:size-4.5 [&:has(>div>i)>div]:size-4.5",
        lg: "h-12 rounded-md px-6 has-[>svg]:px-6 has-[_i]:px-6 [&_svg:not([class*='size-'])]:size-5 [&:has(>div>i)>div]:size-5 rounded-lg",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
)

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    isLoading?: boolean
    startContent?: React.ReactNode
    endContent?: React.ReactNode
    spinnerPlacement?: "start" | "end"
    isIconOnly?: boolean
  }

function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading,
  startContent,
  endContent,
  children,
  isIconOnly,
  spinnerPlacement = "start",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
      disabled={isLoading || props.disabled}
    >
      {startContent}
      {isLoading && spinnerPlacement === "start" && <Spinner size="sm" color="current" />}
      {isLoading && isIconOnly ? null : children}
      {isLoading && spinnerPlacement === "end" && <Spinner size="sm" color="current" />}
      {endContent}
    </Comp>
  )
}

export { Button, buttonVariants }
