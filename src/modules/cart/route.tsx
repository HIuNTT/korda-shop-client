import Authorization from "@/components/layout/Authorization"
import { paths } from "@/constants/paths"
import { Roles } from "@/constants/role"
import { lazy } from "react"
import { RouteObject } from "react-router"

const Cart = lazy(() => import("./pages/Cart"))

export const cartRoute: RouteObject = {
  path: paths.cart.path.slice(1),
  element: <Authorization allowedRoles={[Roles.ADMIN, Roles.USER]} />,
  children: [
    {
      path: "",
      Component: Cart,
    },
  ],
}
