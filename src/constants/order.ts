import { MyOrderProcessing } from "@/modules/account/services/getMyOrder"
import { ElementType } from "react"
import { LuReceiptText, LuPackageCheck } from "react-icons/lu"
import { PiMoneyWavy } from "react-icons/pi"
import { LiaShippingFastSolid } from "react-icons/lia"
import { GoStar } from "react-icons/go"
import { PaymentMethodType } from "./paymentMethodType"

export enum OrderStatusType {
  AWAITING_PAYMENT,
  AWAITING_CONFIRMATION,
  CONFIRMED,
  DELIVERING,
  COMPLETED,
  CANCELED,
}

export const orderStatusTabs: { title: string; status?: OrderStatusType }[] = [
  { title: "Tất cả" },
  { title: "Chờ thanh toán", status: OrderStatusType.AWAITING_PAYMENT },
  { title: "Chờ xác nhận", status: OrderStatusType.AWAITING_CONFIRMATION },
  { title: "Đã xác nhận", status: OrderStatusType.CONFIRMED },
  { title: "Đang giao", status: OrderStatusType.DELIVERING },
  { title: "Hoàn thành", status: OrderStatusType.COMPLETED },
  { title: "Đã hủy", status: OrderStatusType.CANCELED },
]

export const orderStatusTitles: Record<OrderStatusType, string> = {
  [OrderStatusType.AWAITING_PAYMENT]: "Chờ thanh toán",
  [OrderStatusType.AWAITING_CONFIRMATION]: "Chờ xác nhận",
  [OrderStatusType.CONFIRMED]: "Đã xác nhận",
  [OrderStatusType.DELIVERING]: "Đang giao",
  [OrderStatusType.COMPLETED]: "Hoàn thành",
  [OrderStatusType.CANCELED]: "Đã hủy",
}

export const orderStatusDetails: Record<OrderStatusType, string> = {
  [OrderStatusType.AWAITING_PAYMENT]: "Chờ thanh toán",
  [OrderStatusType.AWAITING_CONFIRMATION]: "Chờ xác nhận",
  [OrderStatusType.CONFIRMED]: "Đã xác nhận đơn hàng",
  [OrderStatusType.DELIVERING]: "Đang giao hàng",
  [OrderStatusType.COMPLETED]: "Đơn hàng đã hoàn thành",
  [OrderStatusType.CANCELED]: "Đơn hàng đã hủy",
}

export interface OrderStep {
  key: keyof Omit<MyOrderProcessing, "is_rated">
  icon: ElementType
  title: string | Function
  finishTitle?: string | Function
}

export const orderSteps: OrderStep[] = [
  {
    key: "create_time",
    title: "Đơn Hàng Đã Đặt",
    icon: LuReceiptText,
  },
  {
    key: "confirm_time",
    title: (paymentMethod: PaymentMethodType) => {
      if (paymentMethod === PaymentMethodType.COD) {
        return "Chờ Xác Nhận"
      } else {
        return "Chờ Thanh Toán"
      }
    },
    icon: PiMoneyWavy,
    finishTitle: (paymentMethod: PaymentMethodType) => {
      if (paymentMethod === PaymentMethodType.COD) {
        return "Đã Xác Nhận Thông Tin Thanh Toán"
      } else {
        return "Đơn Hàng Đã Thanh Toán"
      }
    },
  },
  {
    key: "delivery_time",
    title: "Chờ Vận Chuyển",
    icon: LiaShippingFastSolid,
    finishTitle: "Đã Giao Cho NVVC",
  },
  {
    key: "complete_time",
    title: "Đang Giao",
    icon: LuPackageCheck,
    finishTitle: "Đã Nhận Được Hàng",
  },
  {
    key: "rating_time",
    title: "Đánh Giá",
    icon: GoStar,
  },
]
