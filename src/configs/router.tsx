import RootLayout from "@/components/layout/root"
import { homeRoute } from "@/modules/home/route"
import { createBrowserRouter } from "react-router"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [homeRoute],
  },
  {
    path: "*",
    element: <div>404</div>,
  },
])
