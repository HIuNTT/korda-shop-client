import { api } from "@/configs/api"
import { CartInfo } from "@/types/cart"
import { useMutation } from "@tanstack/react-query"

export interface UpdateCartItemDto {
  item: { item_id: string; quantity: number }
  selected_ids: string[]
}

async function updateCartItemQuantity(data: UpdateCartItemDto) {
  return (await api.post<API.BaseResponse<CartInfo>>("/cart/update", data)).data.data
}

export function useUpdateCartItemQuantity() {
  return useMutation({
    mutationFn: updateCartItemQuantity,
  })
}
