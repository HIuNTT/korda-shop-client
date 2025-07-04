import { api } from "@/configs/api"
import { useMutation } from "@tanstack/react-query"

export interface AddToCartDto {
  item_id: number
  quantity: number
}

async function addToCart(data: AddToCartDto) {
  return (await api.post<API.BaseResponse<{ id: string }>>("/cart", data)).data.data
}

export function useAddToCart() {
  return useMutation({
    mutationFn: addToCart,
  })
}
