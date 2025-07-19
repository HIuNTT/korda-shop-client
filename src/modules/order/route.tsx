import Authorization from "@/components/layout/Authorization"
import { paths } from "@/constants/paths"
import { PaymentMethodType } from "@/constants/paymentMethodType"
import { Roles } from "@/constants/role"
import { RouteObject } from "react-router"

export interface PaymentTypeParams {
  paymentType: PaymentMethodType
}

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
    {
      path: "xu-ly-thanh-toan/:paymentType",
      lazy: async () => {
        let { default: PaymentCallback } = await import("../payment/pages/PaymentCallback")
        return {
          Component: PaymentCallback,
        }
      },
    },
    {
      path: paths.order.success.path.slice(1),
      lazy: async () => {
        let { default: OrderSuccess } = await import("./pages/OrderSuccess")
        return {
          Component: OrderSuccess,
        }
      },
    },
    {
      path: paths.order.failure.path.slice(1),
      lazy: async () => {
        let { default: OrderFailure } = await import("./pages/OrderFailure")
        return {
          Component: OrderFailure,
        }
      },
    },
  ],
}
