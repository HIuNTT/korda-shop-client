import * as React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Skeleton } from "@/components/ui/skeleton"
import { House } from "lucide-react"
import { Link } from "react-router"
import { cn } from "@/lib/utils"

interface Props {
  isLoading: boolean
  breadcrumbs?: { name: string; path: string }[]
  name?: string
}

export default function Breadcrumbs({ isLoading, breadcrumbs, name }: Props) {
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    document.addEventListener("scroll", onScroll, { passive: true })
    return () => document.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div>
      <div
        className={cn(
          "bg-background fixed left-0 z-50 w-full py-3",
          "transition-shadow duration-300",
          offset > 5 && "dark:shadow-muted shadow-md",
        )}
      >
        <div className="mx-auto max-w-[1200px] max-[1200px]:px-4">
          <Breadcrumb>
            {isLoading ? (
              <BreadcrumbList className="flex-nowrap overflow-x-auto">
                {Array(4)
                  .fill("")
                  .map((_, idx) => (
                    <React.Fragment key={idx}>
                      <BreadcrumbItem>
                        <Skeleton className="h-5 w-15" />
                      </BreadcrumbItem>
                      {idx < 3 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
              </BreadcrumbList>
            ) : (
              <BreadcrumbList className="flex-nowrap overflow-x-auto">
                <BreadcrumbItem className="whitespace-nowrap">
                  <House className="size-3.5" />
                  <BreadcrumbLink asChild>
                    <Link to="/">Trang chủ</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {breadcrumbs?.map((b, idx) => (
                  <React.Fragment key={idx}>
                    <BreadcrumbItem className="whitespace-nowrap">
                      <BreadcrumbLink asChild>
                        <Link to={b.path}>{b.name}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </React.Fragment>
                ))}
                <BreadcrumbItem className="whitespace-nowrap">
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            )}
          </Breadcrumb>
        </div>
      </div>
      <div className="pt-16"></div>
    </div>
  )
}
