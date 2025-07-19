import { FormControl, FormItem, FormLabel } from "@/components/ui/form"
import { RadioGroupItem, RadioGroup as ShadcnRadioGroup } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import * as React from "react"

interface RadioOption {
  label: string
  value: string | number | boolean
}

export interface RadioGroupProps extends React.ComponentProps<typeof ShadcnRadioGroup> {
  t: "radio-group"
  hideError?: boolean
  options: RadioOption[]
}
export default function RadioGroup({
  t,
  hideError,
  options,
  className,
  ...props
}: RadioGroupProps) {
  if (t === "radio-group") {
    return (
      <FormControl hideError={hideError}>
        <ShadcnRadioGroup {...props} className={cn("flex items-center", className)}>
          {options.map((option, idx) => (
            <FormItem key={idx} className="flex cursor-pointer items-center">
              <FormControl hideError={hideError}>
                <RadioGroupItem value={option.value.toString()} />
              </FormControl>
              <FormLabel className="cursor-pointer pl-3 font-normal">{option.label}</FormLabel>
            </FormItem>
          ))}
        </ShadcnRadioGroup>
      </FormControl>
    )
  }
}
