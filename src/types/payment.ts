import { PaymentMethodType } from "@/constants/paymentMethodType"

export interface PaymentMethod {
  id: number
  name: string
  key: PaymentMethodType
  image_url: string
  is_actived: boolean
}
