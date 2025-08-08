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
