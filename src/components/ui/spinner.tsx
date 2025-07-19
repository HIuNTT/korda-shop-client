import { cn } from "@/lib/utils"
import { ComponentProps } from "react"

const spinnerVariants = {
  variant: {
    default: {
      circle1: [
        "animate-spinner-ease-spin",
        "border-solid",
        "border-t-transparent",
        "border-l-transparent",
        "border-r-transparent",
      ],
      circle2: [
        "opacity-75",
        "animate-spinner-linear-spin",
        "border-dotted",
        "border-t-transparent",
        "border-l-transparent",
        "border-r-transparent",
      ],
    },
  },
  size: {
    sm: {
      wrapper: "h-5 w-5",
      circle1: "border-2",
      circle2: "border-2",
    },
    md: {
      wrapper: "h-8 w-8",
      circle1: "border-4",
      circle2: "border-4",
    },
    lg: {
      wrapper: "h-10 w-10",
      circle1: "border-4",
      circle2: "border-4",
    },
  },
  color: {
    primary: {
      circle1: "border-b-primary",
      circle2: "border-b-primary",
    },
    secondary: {
      circle1: "border-b-secondary",
      circle2: "border-b-secondary",
    },
    destructive: {
      circle1: "border-b-destructive",
      circle2: "border-b-destructive",
    },
    current: {
      circle1: "border-b-current",
      circle2: "border-b-current",
    },
  },
}

interface SpinnerProps {
  size?: keyof (typeof spinnerVariants)["size"]
  color?: keyof (typeof spinnerVariants)["color"]
  variant?: keyof (typeof spinnerVariants)["variant"]
}

function Spinner({
  className,
  size = "md",
  color = "primary",
  variant = "default",
  ...props
}: ComponentProps<"div"> & SpinnerProps) {
  return (
    <div className={cn("relative flex", spinnerVariants.size[size].wrapper, className)} {...props}>
      <i
        className={cn(
          "absolute h-full w-full rounded-full",
          spinnerVariants.size[size].circle1,
          spinnerVariants.variant[variant].circle1.join(" "),
          spinnerVariants.color[color].circle1,
        )}
      ></i>
      <i
        className={cn(
          "absolute h-full w-full rounded-full",
          spinnerVariants.size[size].circle2,
          spinnerVariants.variant[variant].circle2.join(" "),
          spinnerVariants.color[color].circle2,
        )}
      ></i>
    </div>
  )
}

export { Spinner, spinnerVariants }
