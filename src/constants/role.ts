export enum Roles {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type RoleTypes = keyof typeof Roles
