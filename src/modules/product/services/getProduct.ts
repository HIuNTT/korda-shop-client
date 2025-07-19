import { api } from "@/configs/api"
import { AttributeItem, DefaultAttribute } from "@/types/attribute"
import { Product } from "@/types/product"
import { useQuery } from "@tanstack/react-query"

interface GetProductVariant {
  id: number
  image_url: string
  color: string
  price: number
  original_price: number
  discount_percent: number
  stock: number
  is_default: boolean
}

export interface BreadcrumbItem {
  path: string
  name: string
}

export interface GetProductResponse extends Product {
  discount_percent: number
  aggregate_rating: number
  default_attributes: DefaultAttribute[]
  attribute_items: AttributeItem[]
  breadcrumbs: BreadcrumbItem[]
  product_versions: {
    slug: string
    name: string
    price: number
  }[]
  variants: GetProductVariant[]
}

async function getProduct(slug: string) {
  return (await api.get<API.BaseResponse<GetProductResponse>>(`/product/${slug}`)).data.data
}

export function useGetProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
  })
}
