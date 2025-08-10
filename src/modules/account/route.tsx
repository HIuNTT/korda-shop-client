import AccountLayout from "@/components/layout/account"
import Authorization from "@/components/layout/Authorization"
import { paths } from "@/constants/paths"
import { Roles } from "@/constants/role"
import { RouteObject } from "react-router"

export interface MyOrderParams {
  id: string
}

export const accountRoute: RouteObject = {
  path: paths.account.root.path.slice(1),
  element: (
    <Authorization allowedRoles={[Roles.USER, Roles.ADMIN]}>
      <AccountLayout />
    </Authorization>
  ),
  children: [
    {
      path: paths.account.address.path.slice(1),
      lazy: async () => {
        const { default: Address } = await import("./pages/Address")
        return {
          Component: Address,
        }
      },
      handle: {
        crumb: () => "Sổ địa chỉ",
      },
    },
    {
      path: paths.account.order.list.path.slice(1),
      handle: {
        crumb: () => "Đơn hàng của tôi",
      },
      children: [
        {
          index: true,
          lazy: async () => {
            const { default: MyOrder } = await import("./pages/MyOrder")
            return {
              Component: MyOrder,
            }
          },
        },
        {
          path: paths.account.order.detail.path.slice(1),
          lazy: async () => {
            const { default: MyOrderDetail } = await import("./pages/MyOrderDetail")
            return {
              Component: MyOrderDetail,
            }
          },
          handle: {
            crumb: () => "Chi tiết đơn hàng",
          },
        },
      ],
    },
  ],
}
