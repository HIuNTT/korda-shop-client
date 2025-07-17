import { api } from "@/configs/api"
import { Address } from "@/types/address"
import { useQuery } from "@tanstack/react-query"

async function getAddressList() {
  return (await api.get<API.BaseResponse<Address[]>>("/account/address")).data.data
}

export function useGetAddressList(enabled?: boolean, key?: string) {
  return useQuery({
    queryKey: ["get-address-list", key],
    queryFn: getAddressList,
    enabled,
  })
}
