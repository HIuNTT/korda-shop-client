import AccountLayout from "@/components/layout/account"
import Authorization from "@/components/layout/Authorization"
import { paths } from "@/constants/paths"
import { Roles } from "@/constants/role"
import { RouteObject } from "react-router"

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
  ],
}
