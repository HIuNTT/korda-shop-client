export enum PaymentMethodType {
  COD = "cod",
  VNPAY = "vnpay",
  MOMO = "momo",
  ZALOPAY = "zalopay",
  TRANSFER_ONLINE = "transfer_online",
}

export const PaymentMethodTitle: Record<PaymentMethodType, string> = {
  [PaymentMethodType.COD]: "Thanh toán khi nhận hàng",
  [PaymentMethodType.VNPAY]: "VNPAY",
  [PaymentMethodType.MOMO]: "Ví MoMo",
  [PaymentMethodType.ZALOPAY]: "Ví ZaloPay",
  [PaymentMethodType.TRANSFER_ONLINE]: "Chuyển khoản ngân hàng",
}
