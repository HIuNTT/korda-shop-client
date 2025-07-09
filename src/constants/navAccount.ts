import { ElementType } from "react"
import { paths } from "./paths"
import { BiUser, BiSolidUser } from "react-icons/bi"
import { BsBoxSeam, BsBoxSeamFill } from "react-icons/bs"
import { IoLocationOutline, IoLocation } from "react-icons/io5"

export interface NavAccountItem {
  title: string
  url: string
  iconOutline?: ElementType
  iconSolid?: ElementType
}

export const navAccountData: NavAccountItem[] = [
  {
    title: "Thông tin tài khoản",
    url: paths.account.info.getHref(),
    iconOutline: BiUser,
    iconSolid: BiSolidUser,
  },
  {
    title: "Đơn hàng của tôi",
    url: paths.account.order.getHref(),
    iconOutline: BsBoxSeam,
    iconSolid: BsBoxSeamFill,
  },
  {
    title: "Sổ địa chỉ nhận hàng",
    url: paths.account.address.getHref(),
    iconOutline: IoLocationOutline,
    iconSolid: IoLocation,
  },
]
