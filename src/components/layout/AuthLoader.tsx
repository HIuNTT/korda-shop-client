import { useGetProfile } from "@/modules/user/services/getProfile"
import { useUser } from "@/stores/user"
import { PropsWithChildren, useEffect } from "react"
import LoadingPage from "../common/LoadingPage"

export default function AuthLoader({ children }: PropsWithChildren) {
  const { user, auth, setUser, clear } = useUser()
  const { isFetched, isError, data } = useGetProfile(!!auth.access_token && !user.id)

  useEffect(() => {
    if (data) {
      setUser(data)
    }

    if (isError) {
      clear()
    }
  }, [data, isError, setUser, clear])

  if (!isFetched && auth.access_token) {
    return <LoadingPage />
  }

  return children
}
