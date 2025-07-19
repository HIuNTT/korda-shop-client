import { ComponentProps, ReactNode } from "react"
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface Props extends Omit<ComponentProps<typeof TooltipContent>, "content"> {
  content: ReactNode
  isDisplay?: boolean
  delayDuration?: number
}

export default function Tooltip({
  content,
  children,
  isDisplay = true,
  delayDuration,
  ...props
}: Props) {
  if (!isDisplay) return children

  return (
    <ShadcnTooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent {...props}>{content}</TooltipContent>
    </ShadcnTooltip>
  )
}
