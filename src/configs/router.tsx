import AdminLayout from "@/components/layout/admin"
import AuthLoader from "@/components/layout/AuthLoader"
import Authorization from "@/components/layout/Authorization"
import RootLayout from "@/components/layout/root"
import { paths } from "@/constants/paths"
import { Roles } from "@/constants/role"
import { homeRoute } from "@/modules/home/route"
import { adminProductRoute } from "@/modules/product-admin/route"
import { createBrowserRouter } from "react-router"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [homeRoute],
  },
  {
    path: paths.admin.home.getHref(),
    handle: {
      crumb: () => "Trang chủ",
    },
    element: (
      <AuthLoader>
        <Authorization allowedRoles={[Roles.ADMIN]} forbiddenFallback={<div>Cần là admin</div>}>
          <AdminLayout />
        </Authorization>
      </AuthLoader>
    ),
    children: [adminProductRoute],
  },
  {
    path: "*",
    element: <div>404</div>,
  },
])
