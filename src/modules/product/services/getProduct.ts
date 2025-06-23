import { api } from "@/configs/api"
import { AttributeItem, DefaultAttribute } from "@/types/attribute"
import { Product } from "@/types/product"
import { useQuery } from "@tanstack/react-query"

export interface GetProductResponse extends Product {
  discount_percent: number
  aggregate_rating: number
  default_attributes: DefaultAttribute[]
  attribute_items: AttributeItem[]
  breadcrumbs: { path: string; name: string }[]
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
