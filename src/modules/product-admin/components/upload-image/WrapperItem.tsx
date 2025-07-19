import { cn } from "@/lib/utils"
import { ComponentPropsWithRef } from "react"

export default function WrapperItem({
  ref,
  children,
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  return (
    <div className={cn("size-20", className)} ref={ref} {...props}>
      {children}
    </div>
  )
}
