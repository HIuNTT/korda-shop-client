import { api } from "@/configs/api"
import { useUser } from "@/stores/user"
import { User } from "@/types/user"
import { useMutation, useQuery } from "@tanstack/react-query"

interface GetProfileResponse extends User {}

async function getProfile() {
  return (await api.get<GetProfileResponse>("/account/profile")).data
}

export function useGetProfile(enabled?: boolean) {
  return useQuery({
    queryKey: ["getProfile", useUser.getState().user.email],
    queryFn: getProfile,
    enabled,
  })
}
