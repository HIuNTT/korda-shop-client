import { Outlet } from "react-router"
import Header from "./header"

export default function RootLayout() {
  return (
    <div>
      <Header />
      <div className="mx-auto max-w-[1200px] max-[1200px]:px-4">
        <Outlet />
      </div>
    </div>
  )
}
