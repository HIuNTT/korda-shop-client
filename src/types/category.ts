export interface Category {
  id: number
  name: string
  order_no: number
  slug: string
  image_url?: string
  mpath?: string
  parent_id: number | null
  children?: Category[]
  created_at: string
  updated_at: string
  deleted_at?: string | null
}
