import { lazy } from "react"
import { RouteObject } from "react-router"

const Product = lazy(() => import("./pages/Product"))

export interface ProductParams {
  slug: string
}

export const productRoute: RouteObject = {
  path: "san-pham",
  children: [
    {
      path: ":slug",
      Component: Product,
    },
  ],
}
