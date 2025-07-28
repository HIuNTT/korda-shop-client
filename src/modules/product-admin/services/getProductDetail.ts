import { api } from "@/configs/api"
import { CreateProductDto } from "./createProduct"
import { useQuery } from "@tanstack/react-query"

export interface ProductDetail extends Omit<CreateProductDto, "category_ids"> {
  id: number
  category_ids: number[][]
}

interface ProductDetailParams {
  slug: string
}

async function getProductDetail(params: ProductDetailParams) {
  return (
    await api.get<API.BaseResponse<ProductDetail>>("/product/detail", {
      params,
    })
  ).data.data
}

export function useGetProductDetail(params: ProductDetailParams, enabled?: boolean) {
  return useQuery({
    queryKey: ["get-product-detail", params.slug],
    queryFn: () => getProductDetail(params),
    enabled,
  })
}
