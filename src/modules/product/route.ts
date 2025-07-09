import { paths } from "@/constants/paths"
import { RouteObject } from "react-router"

export interface ProductParams {
  slug: string
}

export const productRoute: RouteObject = {
  path: paths.product.path.slice(1),
  children: [
    {
      path: ":slug",
      lazy: async () => {
        const { default: Product } = await import("./pages/Product")
        return {
          Component: Product,
        }
      },
    },
  ],
}
