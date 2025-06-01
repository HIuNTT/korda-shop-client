import { api } from "@/configs/api"
import { User } from "@/types/user"
import { useQuery } from "@tanstack/react-query"

interface GetProfileResponse extends User {}

async function getProfile() {
  return (await api.get<API.BaseResponse<GetProfileResponse>>("/account/profile")).data.data
}

export function useGetProfile(enabled?: boolean) {
  return useQuery({
    queryKey: ["getProfile"],
    queryFn: getProfile,
    enabled,
  })
}
