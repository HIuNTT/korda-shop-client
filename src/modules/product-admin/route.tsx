import { paths } from "@/constants/paths"
import { RouteObject } from "react-router"
import CreateProduct from "./pages/CreatProduct"

export const adminProductRoute: RouteObject = {
  path: paths.admin.product.list.path.slice(1),
  handle: {
    crumb: () => "Sản phẩm",
  },
  children: [
    {
      index: true,
      element: <div className="h-[2000px]">Danh sách sản phẩm</div>,
    },
    {
      path: paths.admin.product.create.path.slice(1),
      Component: CreateProduct,
      handle: {
        crumb: () => "Thêm sản phẩm",
      },
    },
  ],
}
