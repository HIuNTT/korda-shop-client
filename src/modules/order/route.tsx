import Authorization from "@/components/layout/Authorization"
import { paths } from "@/constants/paths"
import { Roles } from "@/constants/role"
import { RouteObject } from "react-router"

export const orderRoute: RouteObject = {
  path: paths.order.path.slice(1),
  element: <Authorization allowedRoles={[Roles.ADMIN, Roles.USER]} />,
  children: [
    {
      path: "",
      lazy: async () => {
        let { default: Order } = await import("./pages/Order")
        return {
          Component: Order,
        }
      },
    },
  ],
}
