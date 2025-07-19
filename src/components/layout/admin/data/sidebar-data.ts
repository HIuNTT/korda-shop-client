import { paths } from "@/constants/paths"
import { ClipboardList, House, ShoppingBag } from "lucide-react"
import React from "react"

interface BaseNavItem {
  title: string
  icon?: React.ElementType
}

export type NavLink = BaseNavItem & {
  url: string
  items?: never
}

export type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: string })[]
  url?: never
}

export type NavItem = NavCollapsible | NavLink // Dùng never để tách riêng biệt Union giữa NavLink và NavCollapsible

export const sidebarData: NavItem[] = [
  {
    title: "Trang chủ",
    url: paths.admin.home.getHref(),
    icon: House,
  },
  {
    title: "Quản lý đơn hàng",
    icon: ClipboardList,
    items: [
      {
        title: "Danh sách đơn hàng",
        url: paths.admin.order.list.getHref(),
      },
    ],
  },
  {
    title: "Quản lý sản phẩm",
    icon: ShoppingBag,
    items: [
      {
        title: "Danh sách sản phẩm",
        url: paths.admin.product.list.getHref(),
      },
      {
        title: "Thêm sản phẩm",
        url: paths.admin.product.create.getHref(),
      },
    ],
  },
]
