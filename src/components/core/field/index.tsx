import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import Input, { InputProps } from "./Input"
import InputOTP, { InputOTPProps } from "./InputOTP"
import { cn } from "@/lib/utils"
import InputEditor, { InputEditorProps } from "./InputEditor"
import InputUploadImage, { InputUploadImageProps } from "./InputUploadImage"
import InputCascader, { InputCascaderProps } from "./InputCascader"
import { Cascader, CascaderContent, CascaderProps } from "@/components/ui/cascader"
import Textarea, { TextareaProps } from "./Textarea"
import RadioGroup, { RadioGroupProps } from "./RadioGroup"
import InputMySelect, { InputMySelectProps } from "./InputMySelect"

export type FieldProps = {
  name: string
  isRequired?: boolean
  label?: string
  description?: string
  errorMessage?: string
  labalPlacement?: "outside" | "outside-left"
  colon?: boolean
  size?: "md" | "lg" | "sm"
  labelSpan?: number
  wrapperSpan?: number
  labelWidth?: number
} & (
  | InputProps
  | InputOTPProps
  | InputEditorProps
  | InputUploadImageProps
  | (InputCascaderProps & CascaderProps)
  | TextareaProps
  | RadioGroupProps
  | InputMySelectProps
)

export default function Field({
  name,
  label,
  description,
  errorMessage,
  isRequired,
  labalPlacement = "outside",
  colon = true,
  labelSpan,
  wrapperSpan,
  labelWidth,
  ...props
}: FieldProps) {
  const { control } = useFormContext()
  const { t, hideError, size = "md" } = props

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        const { onChange, ...restField } = field

        return (
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
                  "leading-none",
                  labalPlacement === "outside-left" && "flex h-9 items-center justify-end",
                  labalPlacement === "outside-left" && size === "lg" && "h-10",
                  labalPlacement === "outside-left" && size === "sm" && "h-8",
                )}
                style={{
                  gridColumn: labelSpan ? `span ${labelSpan} / span ${labelSpan}` : undefined,
                  width: labelWidth ? `${labelWidth}px` : undefined,
                }}
              >
                <FormLabel
                  className={cn(
                    "align-top",
                    isRequired &&
                      "before:text-destructive before:me-1 before:text-[10px] before:content-['*']",
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
              {(t === "input" || t === "password-input" || t === "input-number") && (
                <Input {...props} {...field} />
              )}

              {t === "input-otp" && <InputOTP {...props} {...field} />}

              {t === "input-editor" && (
                <InputEditor {...props} {...restField} onEditorChange={onChange} />
              )}

              {t === "input-upload-image" && (
                <div>
                  <InputUploadImage {...props} {...restField} onChange={onChange} />
                </div>
              )}

              {t === "input-cascader" && (
                <Cascader {...props} value={field.value} onChange={field.onChange}>
                  <InputCascader
                    t={t}
                    hideError={hideError}
                    cascaderTriggerProps={props.cascaderTriggerProps}
                    cascaderValueProps={props.cascaderValueProps}
                  />
                  <CascaderContent />
                </Cascader>
              )}

              {(t === "textarea" || t === "input-textarea") && <Textarea {...props} {...field} />}

              {t === "radio-group" && (
                <RadioGroup
                  {...props}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className={cn("min-h-9 flex-wrap gap-3", size === "lg" && "min-h-10 gap-4")}
                />
              )}

              {t === "input-my-select" && (
                <InputMySelect
                  {...props}
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                />
              )}

              {description && <FormDescription>{description}</FormDescription>}
              {!hideError && <FormMessage>{errorMessage ?? null}</FormMessage>}
            </div>
          </FormItem>
        )
      }}
    />
  )
}
