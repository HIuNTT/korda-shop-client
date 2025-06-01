import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react"
import { Link, useMatches } from "react-router"

type HandleType = {
  crumb: () => string
}

export default function Breadcrumbs() {
  const matches = useMatches().filter((item) => item.handle)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {matches.map((item, idx) => (
          <React.Fragment key={idx}>
            <BreadcrumbItem>
              {idx === matches.length - 1 ? (
                <BreadcrumbPage>{(item.handle as HandleType).crumb()}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.pathname}>{(item.handle as HandleType).crumb()}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {idx !== matches.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
