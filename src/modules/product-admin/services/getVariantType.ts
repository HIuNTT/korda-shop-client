import { api } from "@/configs/api"
import { VariantType } from "@/types/variant"
import { useQuery } from "@tanstack/react-query"

interface GetVariantTypeResponse extends VariantType {}

async function getVariantType() {
  return (
    await api.get<API.BaseResponse<GetVariantTypeResponse[]>>("/product-variant/variant-type/all")
  ).data.data
}

export function useGetVariantType(enabled?: boolean) {
  return useQuery({
    queryKey: ["get-all-variant-type"],
    queryFn: getVariantType,
    enabled,
  })
}
