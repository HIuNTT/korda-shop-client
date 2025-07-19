import { api } from "@/configs/api"
import { AttributeGroup } from "@/types/attribute"
import { useMutation } from "@tanstack/react-query"

export interface GetAttributesDto {
  category_ids: number[]
}

async function getAttributes(data: GetAttributesDto) {
  return (await api.post<API.BaseResponse<AttributeGroup[]>>("/product/get-attributes", data)).data
    .data
}

export function useGetAttributes() {
  return useMutation({
    mutationFn: getAttributes,
  })
}
