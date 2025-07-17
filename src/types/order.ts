import { CartPrices } from "./cart"

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
