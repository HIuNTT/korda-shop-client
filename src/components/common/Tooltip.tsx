import { ComponentProps, ReactNode } from "react"
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface Props extends Omit<ComponentProps<typeof TooltipContent>, "content"> {
  content: ReactNode
}

export default function Tooltip({ content, children, ...props }: Props) {
  return (
    <ShadcnTooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent {...props}>{content}</TooltipContent>
    </ShadcnTooltip>
  )
}
