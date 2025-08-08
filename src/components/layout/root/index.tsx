import { Outlet, ScrollRestoration } from "react-router"
import Header from "./header"
import ProgressBar from "../ProgressBar"

export default function RootLayout() {
  return (
    <div>
      <ProgressBar />
      <Header />
      <Outlet />
      <div className="h-30" />
      <ScrollRestoration />
    </div>
  )
}
