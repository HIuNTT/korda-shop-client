import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

export default function Home() {
  console.log("Home")

  return (
    <div className="h-[2000px]">
      Home
      <div>
        <Spinner />
        <Button className="mx-2" onClick={() => toast.error("lỗi nè cu")}>
          Test nỗi
        </Button>
      </div>
    </div>
  )
}
