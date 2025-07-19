import { api } from "@/configs/api"
import { CartInfo } from "@/types/cart"
import { useQuery } from "@tanstack/react-query"

async function getCartInfo() {
  return (await api.get<API.BaseResponse<CartInfo>>("/cart")).data.data
}

export function useGetCartInfo() {
  return useQuery({
    queryKey: ["cart-info"],
    queryFn: getCartInfo,
  })
}
