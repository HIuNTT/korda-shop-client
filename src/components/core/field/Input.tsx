import { FormControl } from "@/components/ui/form"
import { Input as ShadcnInput, InputProps as ShadcnInputProps } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export interface InputProps extends ShadcnInputProps {
  t: "input" | "password-input"
  hideError?: boolean
}

export default function Input({ t, hideError, ...props }: InputProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  if (t === "input") {
    return (
      <FormControl hideError={hideError}>
        <ShadcnInput {...props} />
      </FormControl>
    )
  }

  if (t === "password-input") {
    return (
      <FormControl hideError={hideError}>
        <ShadcnInput
          type={isVisible ? "text" : "password"}
          endContent={
            <button
              className="hover:bg-foreground/5 active:bg-foreground/10 pointer-events-none cursor-pointer rounded-full p-[5px] opacity-0 transition-opacity duration-150 ease-out select-none peer-data-[filled=true]:pointer-events-auto peer-data-[filled=true]:block peer-data-[filled=true]:opacity-100"
              aria-label="toggle password visibility"
              tabIndex={-1}
              type="button"
              onClick={(e) => {
                setIsVisible(!isVisible)
                e.stopPropagation()
              }}
            >
              {isVisible ? <Eye /> : <EyeOff />}
            </button>
          }
          {...props}
        />
      </FormControl>
    )
  }

  return null
}
