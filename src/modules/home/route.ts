import { lazy } from "react"
import { RouteObject } from "react-router"

const Home = lazy(() => import("./pages/Home"))

export const homeRoute: RouteObject = {
  path: "",
  Component: Home,
}
