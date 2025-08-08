import { CartPrices } from "./cart"
import { PaymentMethod } from "./payment"

export interface QuotePrices extends CartPrices {
  estimated_shipping_price: number
}

export interface QuoteProduct {
  id: number
  name: string
  image: string
  quantity: number
  price: number
  original_price: number
}

export interface QuoteInfo {
  id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  products: QuoteProduct[]
  prices: QuotePrices
}

export interface Order {
  id: number
  code: string
  note?: string
  subtotal_price: number
  total_price: number
  shipping_price: number
  voucher_price: number
  payment_method: PaymentMethod
  created_at: string
  updated_at: string
}
