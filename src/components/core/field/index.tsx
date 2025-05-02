import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import Input, { InputProps } from "./Input"
import InputOTP, { InputOTPProps } from "./InputOTP"

type FieldProps = {
  name: string
  label?: string
  description?: string
  errorMessage?: string
} & (InputProps | InputOTPProps)

export default function Field({ name, label, description, errorMessage, ...props }: FieldProps) {
  const { control } = useFormContext()
  const { t, hideError } = props
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          {(t === "input" || t === "password-input") && <Input {...props} {...field} />}
          {t === "input-otp" && <InputOTP {...props} {...field} />}
          {description && <FormDescription>{description}</FormDescription>}
          {!hideError && <FormMessage>{errorMessage ?? null}</FormMessage>}
        </FormItem>
      )}
    />
  )
}
