import { api } from "@/configs/api"
import { ProductGroup } from "@/types/product"
import { useQuery } from "@tanstack/react-query"

async function getProductGroup() {
  return (await api.get<API.BaseResponse<ProductGroup[]>>("/product-group/all")).data.data
}

export function useGetProductGroup() {
  return useQuery({
    queryKey: ["get-product-group"],
    queryFn: getProductGroup,
  })
}
