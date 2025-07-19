export interface CartProductVariant {
  id: number
  name: string
  color: string
  image: string
  stock: number
}

export interface CartProduct {
  id: string
  name: string
  image: string
  slug: string
  variant_id: number
  quantity: number
  stock: number
  variants: CartProductVariant[]
  price: number
  original_price: number
}

export interface CartPrices {
  total_discount: number
  total: number
  total_voucher_price: number
  estimated_price: number
}

export interface CartInfo {
  products: CartProduct[]
  prices: CartPrices
}
