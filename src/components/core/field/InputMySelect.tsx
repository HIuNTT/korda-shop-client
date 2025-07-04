import { FormControl } from "@/components/ui/form"
import { MySelect, MySelectProps } from "../my-select/MySelect"
import { cn } from "@/lib/utils"

export interface InputMySelectProps extends MySelectProps {
  t: "input-my-select"
  hideError?: boolean
}
export default function InputMySelect({ t, hideError, className, ...props }: InputMySelectProps) {
  if (t === "input-my-select") {
    return (
      <FormControl hideError={hideError}>
        <MySelect {...props} className={cn("w-full", className)} />
      </FormControl>
    )
  }
}
