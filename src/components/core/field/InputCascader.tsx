import {
  CascaderTrigger,
  CascaderTriggerProps,
  CascaderValue,
  CascaderValueProps,
} from "@/components/ui/cascader"
import { FormControl } from "@/components/ui/form"

export interface InputCascaderProps {
  t: "input-cascader"
  hideError?: boolean
  cascaderTriggerProps?: CascaderTriggerProps
  cascaderValueProps?: CascaderValueProps
}

export default function InputCascader({
  t,
  hideError,
  cascaderTriggerProps,
  cascaderValueProps,
}: InputCascaderProps) {
  if (t === "input-cascader") {
    return (
      <>
        <FormControl hideError={hideError}>
          <CascaderTrigger {...cascaderTriggerProps}>
            <CascaderValue {...cascaderValueProps} />
          </CascaderTrigger>
        </FormControl>
      </>
    )
  }

  return null
}
