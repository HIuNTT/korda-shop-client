import Authorization from "@/components/layout/Authorization"
import { paths } from "@/constants/paths"
import { Roles } from "@/constants/role"
import { RouteObject } from "react-router"

export const cartRoute: RouteObject = {
  path: paths.cart.path.slice(1),
  element: <Authorization allowedRoles={[Roles.ADMIN, Roles.USER]} />,
  children: [
    {
      path: "",
      lazy: async () => {
        let { default: Cart } = await import("./pages/Cart")
        return {
          Component: Cart,
        }
      },
    },
  ],
}
