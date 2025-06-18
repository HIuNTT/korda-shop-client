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
}
