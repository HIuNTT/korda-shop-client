import { Category } from "./category"

export interface Product {
  id: number
  name: string
  slug: string
  thumbnail_url: string
  description: string
  highlight_features: string
  product_state?: string
  included_accessories?: string
  warranty_information?: string
  tax_vat: boolean
  secondary_name?: string
  related_name?: string
  stock: number
  quantity_sold: number
  price: number
  original_price: number
  review_count: number
  is_actived: boolean
  categories: Category[]
  images: ProductImage[]
  created_at: string
  updated_at: string
  deleted_at?: string
}

interface ProductImage {
  url: string
  key: string
  order_no?: number
}

export interface ProductGroup {
  id: number
  name: string
}
