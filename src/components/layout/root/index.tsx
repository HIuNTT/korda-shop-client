import { Outlet } from "react-router"
import Header from "./header"

export default function RootLayout() {
  return (
    <div>
      <Header />
      <Outlet />
      <div className="h-30" />
    </div>
  )
}
