import { Spinner } from "../ui/spinner"

export default function LoadingPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Spinner />
    </div>
  )
}
