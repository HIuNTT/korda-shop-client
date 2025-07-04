import { FormControl } from "@/components/ui/form"
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import * as React from "react"

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  t: "textarea" | "input-textarea"
  hideError?: boolean
}

export default function Textarea({ t, hideError, className, name, ...props }: TextareaProps) {
  if (t === "textarea") {
    return (
      <FormControl hideError={hideError}>
        <ShadcnTextarea {...props} className={className} />
      </FormControl>
    )
  }

  if (t === "input-textarea") {
    return (
      <FormControl hideError={hideError}>
        <ShadcnTextarea className={cn("min-h-10 resize-none px-3.5", className)} {...props} />
      </FormControl>
    )
  }
}
