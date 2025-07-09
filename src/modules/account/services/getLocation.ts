import { api } from "@/configs/api"
import { useQuery } from "@tanstack/react-query"

interface Location {
  id: number
  name: string
  code: string
}

interface LocationParams {
  code: number
}

async function getProvinces() {
  return (await api.get<API.BaseResponse<Location[]>>("/location/province")).data.data
}

export function useGetProvinces(enabled?: boolean) {
  return useQuery({
    queryKey: ["get-provinces"],
    queryFn: getProvinces,
    enabled,
  })
}

async function getDistricts(params: LocationParams) {
  return (await api.get<API.BaseResponse<Location[]>>("/location/district", { params })).data.data
}

export function useGetDistricts(params: LocationParams, enabled?: boolean) {
  return useQuery({
    queryKey: ["get-districts", params.code],
    queryFn: () => getDistricts(params),
    enabled,
  })
}

async function getWards(params: LocationParams) {
  return (await api.get<API.BaseResponse<Location[]>>("/location/ward", { params })).data.data
}

export function useGetWards(params: LocationParams, enabled?: boolean) {
  return useQuery({
    queryKey: ["get-wards", params.code],
    queryFn: () => getWards(params),
    enabled,
  })
}
