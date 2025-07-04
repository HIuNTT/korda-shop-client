import { api } from "@/configs/api"
import { CartInfo } from "@/types/cart"
import { useMutation } from "@tanstack/react-query"

interface ToggleItemDto {
  selected_ids: string[]
}

async function toggleItem(data: ToggleItemDto) {
  return (await api.post<API.BaseResponse<CartInfo>>("/cart/toggle-item", data)).data.data
}

export function useToggleItem() {
  return useMutation({
    mutationFn: toggleItem,
  })
}
