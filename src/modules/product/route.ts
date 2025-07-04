import { paths } from "@/constants/paths"
import { lazy } from "react"
import { RouteObject } from "react-router"

const Product = lazy(() => import("./pages/Product"))

export interface ProductParams {
  slug: string
}

export const productRoute: RouteObject = {
  path: paths.product.path.slice(1),
  children: [
    {
      path: ":slug",
      Component: Product,
    },
  ],
}
