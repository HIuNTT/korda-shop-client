import { FormControl } from "@/components/ui/form"
import {
  InputOTP as ShadcnInputOTP,
  InputOTPProps as ShadcnInputOTPProps,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export type InputOTPProps = Omit<ShadcnInputOTPProps, "render" | "size"> & {
  t: "input-otp"
  hideError?: boolean
  size?: "md" | "lg"
}

export default function InputOTP({ t, hideError, maxLength, size, ...props }: InputOTPProps) {
  if (t === "input-otp") {
    return (
      <FormControl hideError={hideError}>
        <ShadcnInputOTP maxLength={maxLength} {...props}>
          <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
            {maxLength &&
              Array.from({ length: maxLength }).map((_, index) => (
                <InputOTPSlot key={index} size={size} index={index} />
              ))}
          </InputOTPGroup>
        </ShadcnInputOTP>
      </FormControl>
    )
  }

  return null
}
