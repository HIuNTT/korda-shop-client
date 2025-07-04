import { RoleTypes } from "@/constants/role"
import { useUser } from "@/stores/user"
import { PropsWithChildren, ReactNode } from "react"
import { Outlet } from "react-router"

interface AuthorizationProps {
  allowedRoles: RoleTypes[]
  forbiddenFallback?: ReactNode
}

export default function Authorization({
  allowedRoles,
  forbiddenFallback = null,
  children,
}: PropsWithChildren<AuthorizationProps>) {
  const user = useUser()

  const isCanAccess = user.user.id && allowedRoles.includes(user.user.role)

  return isCanAccess ? children || <Outlet /> : forbiddenFallback
}
