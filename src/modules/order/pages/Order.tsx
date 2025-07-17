import Breadcrumbs from "@/components/core/Breadcrumbs"
import { useGetQuote } from "../services/getQuote"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import WaveIcon from "@/components/icons/WaveIcon"
import { formatCurrency } from "@/utils/number"
import QuotePrices from "../components/QuotePrices"
import { useGetPaymentMethod } from "@/modules/payment-method/services/getPaymentMethod"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import Tooltip from "@/components/common/Tooltip"
import ReceivingInfo from "../components/receiving-info"
import { z } from "zod/v4"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router"
import { useEffect } from "react"
import { isEmpty } from "lodash-es"
import { paths } from "@/constants/paths"

const createOrderFormSchema = z.object({
  address_id: z.number().min(1, "Vui lòng chọn địa chỉ nhận hàng"),
  note: z.string().trim().optional(),
  payment_method_id: z.coerce.number().min(1, "Vui lòng chọn phương thức thanh toán"),
  quote_id: z.string(),
})

export type CreateOrderFormSchema = z.infer<typeof createOrderFormSchema>

export default function Order() {
  const form = useForm({
    resolver: zodResolver(createOrderFormSchema),
    defaultValues: {
      payment_method_id: 0,
    },
  })

  const navigate = useNavigate()

  console.log("Order form")

  const getQuote = useGetQuote()
  const getPaymentMethod = useGetPaymentMethod()

  useEffect(() => {
    if (!isEmpty(getQuote.data) && getQuote.isSuccess) {
      form.setValue("quote_id", getQuote.data.id)
    }

    if (getQuote.isError || (getQuote.isSuccess && isEmpty(getQuote.data))) {
      navigate(paths.cart.getHref())
    }
  }, [getQuote.data, getQuote.isSuccess, getQuote.isError, form, navigate])

  return (
    <Form {...form}>
      <Breadcrumbs isLoading={getQuote.isFetching} length={2} name="Thanh toán" />
      <div className="bg-secondary-background py-4">
        <div className="mx-auto min-h-[calc(100vh-132px)] max-w-[1200px] max-[1200px]:px-4">
          <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="grid gap-y-4">
                {/* Sản phẩm */}
                {getQuote.isFetching ? (
                  <div className="bg-background rounded-lg p-4">
                    <Skeleton className="mb-4 h-5 w-2/5 rounded-sm md:h-6" />
                    <div className="flex flex-col gap-4">
                      {Array(3)
                        .fill("")
                        .map((_, index) => (
                          <>
                            <div key={index} className="flex gap-3">
                              <Skeleton className="size-16" />
                              <div className="flex flex-1 flex-col gap-2">
                                <Skeleton className="h-12 w-full rounded-sm" />
                                <div className="flex items-center justify-between gap-3">
                                  <Skeleton className="h-5 w-1/5 rounded-sm" />
                                  <Skeleton className="h-5 w-1/2 rounded-sm" />
                                </div>
                              </div>
                            </div>
                            <div className="border-border h-0 w-full border-b [border-image:repeating-linear-gradient(90deg,var(--border)_0px,var(--border)_10px,transparent_10px,transparent_15px)_1]"></div>
                          </>
                        ))}
                    </div>
                  </div>
                ) : (
                  getQuote.data && (
                    <div className="bg-background rounded-lg p-4">
                      <div className="mb-4 text-base font-semibold md:text-lg">Sản phẩm</div>
                      <div className="flex flex-col gap-4">
                        {getQuote.data.products.map((item) => (
                          <>
                            <div key={item.id} className="flex gap-3">
                              <div className="size-[52px] rounded-sm border p-1.5 md:size-[62px] md:p-[7px]">
                                <img src={item.image} alt={item.name} />
                              </div>
                              <div className="flex flex-1 flex-col gap-3">
                                <div className="text-sm md:text-base md:font-medium">
                                  {item.name}
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                                  <div className="text-muted-foreground text-xs md:text-sm">{`Số lượng: ${item.quantity}`}</div>
                                  <div className="flex flex-wrap items-center gap-x-2">
                                    <div className="text-muted-foreground text-xs font-medium line-through md:text-sm">
                                      {formatCurrency(item.original_price)}
                                    </div>
                                    <div className="text-primary text-sm font-semibold md:text-base">
                                      {formatCurrency(item.price)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="border-border mt-5 h-0 w-full border-b [border-image:repeating-linear-gradient(90deg,var(--border)_0px,var(--border)_10px,transparent_10px,transparent_15px)_1]"></div>
                          </>
                        ))}
                      </div>
                    </div>
                  )
                )}

                {/* Thông tin nhận hàng */}
                <ReceivingInfo />

                {/* Phương thức thanh toán */}
                {getPaymentMethod.isFetching ? (
                  <div className="bg-background rounded-lg p-4">
                    <Skeleton className="mb-4 h-5 w-2/5 rounded-sm md:h-6" />
                    <div className="flex flex-col gap-2">
                      {Array(6)
                        .fill("")
                        .map((_, index) => (
                          <div key={index} className="flex h-15 items-center gap-2 px-3 py-2.5">
                            <Skeleton className="size-5 rounded-full" />
                            <Skeleton className="size-10" />
                            <Skeleton
                              className={cn("h-5 w-1/2 rounded-sm", index % 2 === 0 && "w-1/5")}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  getPaymentMethod.data && (
                    <div className="bg-background rounded-lg p-4">
                      <div className="mb-4 text-base font-semibold md:text-lg">
                        Phương thức thanh toán
                      </div>
                      <FormField
                        control={form.control}
                        name="payment_method_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormMessage />
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value as string}
                                className="gap-2"
                              >
                                {getPaymentMethod.data?.map((method) => (
                                  <FormItem
                                    key={method.id}
                                    className={cn(
                                      "rounded-md",
                                      field.value === method.id.toString() && "bg-secondary",
                                    )}
                                  >
                                    <Tooltip
                                      delayDuration={200}
                                      isDisplay={!method.is_actived}
                                      content={`${method.name.trim()} hiện không khả dụng`}
                                      showArrow={false}
                                      align="start"
                                      alignOffset={44}
                                    >
                                      <FormLabel
                                        hideError
                                        className="flex h-15 cursor-pointer items-center gap-2 px-3 py-2.5 font-normal has-disabled:cursor-not-allowed has-disabled:opacity-50"
                                      >
                                        <FormControl hideError>
                                          <RadioGroupItem
                                            disabled={!method.is_actived}
                                            className="mr-2 disabled:opacity-100"
                                            value={method.id.toString()}
                                          />
                                        </FormControl>

                                        <img
                                          src={method.image_url}
                                          alt={method.name}
                                          className="size-10 object-contain"
                                        />
                                        <div className="text-sm">{method.name}</div>
                                      </FormLabel>
                                    </Tooltip>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="md:col-span-1">
              {getQuote.isFetching ? (
                <div className="flex flex-col">
                  <div className="bg-background flex flex-col gap-2 rounded-t-lg p-4">
                    <Skeleton className="h-11" />
                    <Skeleton className="h-11" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-6 w-2/5" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-5 w-1/4" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-5 w-1/4" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-5 w-1/4" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-5 w-1/4" />
                      </div>
                    </div>
                    <Skeleton className="h-14" />
                  </div>
                  <WaveIcon fill="currentColor" className="text-background w-full" />
                </div>
              ) : (
                getQuote.data && <QuotePrices prices={getQuote.data.prices} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Form>
  )
}
