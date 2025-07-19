import { queryClient } from "@/configs/queryClient"
import { paths } from "@/constants/paths"
import { setObjToSearchParams } from "@/utils/url"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

interface Props {
  orderCode: string
}

export default function CountdownRemainingPayment({ orderCode }: Props) {
  const [seconds, setSeconds] = useState(5 * 60)

  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 0) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (seconds === 0) {
      const searchParams = {
        message: "Thanh toán không thành công",
        generic: "Thanh toán thất bại.",
        spec: "Vui lòng thanh toán lại hoặc chọn phương thức thanh toán khác",
        order_code: orderCode,
      }
      queryClient.refetchQueries({ queryKey: ["count-item-in-cart"] })
      navigate(
        {
          pathname: paths.order.failure.getHref(),
          search: setObjToSearchParams(searchParams),
        },
        {
          replace: true,
        },
      )
    }
  }, [seconds, navigate])

  return (
    <div className="bg-gold-2/50 mt-auto rounded-sm py-[13px] text-center">
      <p className="text-foreground/70 mb-2.5 text-sm">Giao dịch kết thúc sau</p>
      <div className="leading-[1.15] font-medium">
        <span className="text-primary-foreground bg-gold-7/85 mx-2.5 inline-block rounded-md px-[7px] py-[5px] text-[15px]">
          {Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0")}
        </span>{" "}
        :{" "}
        <span className="text-primary-foreground bg-gold-7/85 mx-2.5 inline-block rounded-md px-[7px] py-[5px] text-[15px]">
          {Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0")}
        </span>
      </div>
    </div>
  )
}
