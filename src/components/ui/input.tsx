import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva("", {
  variants: {
    size: {
      sm: "h-8 px-2.5 [&_svg:not([class*='size-'])]:size-3.5",
      md: "h-9 px-3 [&_svg:not([class*='size-'])]:size-4",
      lg: "h-10 px-3.5 [&_svg:not([class*='size-'])]:size-4",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export type InputProps = {
  startContent?: React.ReactNode
  endContent?: React.ReactNode
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  inputClass?: React.ComponentProps<"input">["className"]
} & React.ComponentProps<"div"> &
  Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>

function Input({
  className,
  type,
  size,
  startContent,
  endContent,
  placeholder,
  value,
  onChange,
  id,
  inputMode,
  inputClass,
  defaultValue,
  pattern,
  maxLength,
  ...props
}: InputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <div
      className={cn(
        "group dark:bg-input/30 border-input inline-flex w-full min-w-0 cursor-text items-center rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] duration-150 ease-out outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-2",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        inputVariants({ size, className }),
      )}
      data-size={size}
      onClick={() => inputRef.current?.focus()}
      {...props}
    >
      <div className="inline-flex h-full w-full items-center">
        {startContent}
        <input
          data-has-start-content={startContent ? true : undefined}
          data-has-end-content={endContent ? true : undefined}
          ref={inputRef}
          value={value}
          onChange={onChange}
          id={id}
          type={type}
          data-slot="input"
          data-filled={value ? true : undefined}
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "data-[has-end-content=true]:pe-1.5 data-[has-start-content=true]:ps-1.5",
            "peer",
            inputClass,
          )}
          placeholder={placeholder}
          inputMode={inputMode}
          defaultValue={defaultValue}
          pattern={pattern}
          maxLength={maxLength}
        />
        {endContent}
      </div>
    </div>
  )
}

export { Input, inputVariants }
