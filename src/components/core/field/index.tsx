import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import Input, { InputProps } from "./Input"
import InputOTP, { InputOTPProps } from "./InputOTP"
import { cn } from "@/lib/utils"

type FieldProps = {
  name: string
  isRequired?: boolean
  label?: string
  description?: string
  errorMessage?: string
  labalPlacement?: "outside" | "outside-left"
  colon?: boolean
  size?: "md" | "lg"
  labelSpan?: number
  wrapperSpan?: number
} & (InputProps | InputOTPProps)

export default function Field({
  name,
  label,
  description,
  errorMessage,
  isRequired,
  labalPlacement = "outside",
  colon = true,
  size = "md",
  labelSpan,
  wrapperSpan,
  ...props
}: FieldProps) {
  const { control } = useFormContext()
  const { t, hideError } = props

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem
          className={cn(
            labalPlacement === "outside" && "flex flex-col items-start gap-2",
            labalPlacement === "outside-left" && "flex flex-row items-start",
            labelSpan && wrapperSpan && "grid",
          )}
          style={{
            gridTemplateColumns:
              labelSpan && wrapperSpan
                ? `repeat(${labelSpan + wrapperSpan}, minmax(0, 1fr))`
                : undefined,
          }}
        >
          {label && (
            <div
              className={cn(
                labalPlacement === "outside-left" && "flex h-9 items-center justify-end",
                labalPlacement === "outside-left" && size === "lg" && "h-10",
              )}
              style={{
                gridColumn: labelSpan ? `span ${labelSpan} / span ${labelSpan}` : undefined,
              }}
            >
              <FormLabel
                className={cn(
                  isRequired && "before:text-destructive before:me-1 before:content-['*']",
                  colon && "after:ms-0.5 after:me-2 after:content-[':']",
                )}
              >
                {label}
              </FormLabel>
            </div>
          )}
          <div
            className="w-full space-y-2"
            style={{
              gridColumn: wrapperSpan ? `span ${wrapperSpan} / span ${wrapperSpan}` : undefined,
            }}
          >
            {(t === "input" || t === "password-input") && <Input {...props} {...field} />}
            {t === "input-otp" && <InputOTP {...props} {...field} />}
            {description && <FormDescription>{description}</FormDescription>}
            {!hideError && <FormMessage>{errorMessage ?? null}</FormMessage>}
          </div>
        </FormItem>
      )}
    />
  )
}
