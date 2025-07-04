import { api } from "@/configs/api"
import { useQuery } from "@tanstack/react-query"

async function countItemInCart() {
  return (await api.get<API.BaseResponse<number>>("/cart/count-item")).data.data
}

export function useCountItemInCart(enabled?: boolean) {
  return useQuery({
    queryKey: ["count-item-in-cart"],
    queryFn: countItemInCart,
    enabled,
  })
}
