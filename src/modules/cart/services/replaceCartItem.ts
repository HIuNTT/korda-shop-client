import { api } from "@/configs/api"
import { CartInfo } from "@/types/cart"
import { useMutation } from "@tanstack/react-query"

interface ReplaceCartItemDto {
  item_id: string
  new_variant_id: number
  selected_ids: string[]
}

async function replaceCartItem(data: ReplaceCartItemDto) {
  return (await api.post<API.BaseResponse<CartInfo>>("/cart/replace-item", data)).data.data
}

export function useReplaceCartItem() {
  return useMutation({
    mutationFn: replaceCartItem,
  })
}
