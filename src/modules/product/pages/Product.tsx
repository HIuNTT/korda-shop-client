import { Navigate, useParams } from "react-router"
import { ProductParams } from "../route"
import { useGetProduct } from "../services/getProduct"
import Breadcrumbs from "../components/Breadcrumbs"
import { Skeleton } from "@/components/ui/skeleton"
import Gallery from "../components/Gallery"
import { FaCartPlus, FaStar } from "react-icons/fa"
import { formatCurrency, formatToCompactNumber } from "@/utils/number"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Check, Cpu, PackageCheck, PackageOpen, ShieldCheck, Tags } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import DOMPurify from "dompurify"
import { Drawer } from "@/components/ui/drawer"
import { useDisclosure } from "@/hooks/use-disclosure"
import TechnologyDrawer from "../components/TechnologyDrawer"

export default function Product() {
  const { slug } = useParams<keyof ProductParams>()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  if (!slug) {
    return <Navigate to="/" replace />
  }

  const getProduct = useGetProduct(slug)

  return (
    <>
      <div>
        {/* Breadcrumbs */}
        <Breadcrumbs
          isLoading={getProduct.isFetching}
          breadcrumbs={getProduct.data?.breadcrumbs}
          name={getProduct.data?.name}
        />
        {/* Loading */}
        {getProduct.isLoading ? (
          <div>
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6">
              <div className="flex flex-col gap-4">
                <Skeleton className="h-[410px] rounded-xl" />
                <div className="flex h-20 w-full gap-2 overflow-hidden">
                  {Array(8)
                    .fill("")
                    .map((_, idx) => (
                      <Skeleton key={idx} className="min-h-20 min-w-20 rounded-md" />
                    ))}
                </div>
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-6 rounded-md" />
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-37 rounded-xl" />
                    <Skeleton className="h-37 rounded-xl" />
                    <Skeleton className="h-37 rounded-xl" />
                    <Skeleton className="h-37 rounded-xl" />
                  </div>
                </div>
              </div>
              <div>
                <Skeleton className="mb-3 h-14 rounded-lg" />
                <Skeleton className="h-7 w-3/5" />
                <Skeleton className="mt-4 mb-6 h-7" />
                <div className="mb-5 flex w-auto flex-wrap gap-3">
                  {Array(12)
                    .fill("")
                    .map((_, idx) => (
                      <Skeleton key={idx} className="h-26 w-33 rounded-xl" />
                    ))}
                </div>
                <Skeleton className="mb-5 h-25 rounded-md" />
                <Skeleton className="mb-3 h-25 rounded-md" />
                <Skeleton className="mb-3 h-35 rounded-md" />
                <Skeleton className="mb-3 h-35 rounded-md" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              <Skeleton className="h-220" />
              <Skeleton className="h-183" />
            </div>
            <Skeleton className="mt-4 h-150 rounded-lg" />
            <Skeleton className="mt-4 h-150 rounded-lg" />
          </div>
        ) : (
          getProduct.data && (
            <div>
              <div className="flex flex-col md:grid md:grid-cols-2">
                <div className="h-max md:sticky md:top-[129px]">
                  <Gallery data={getProduct.data.images} />
                  <div className="mt-5 mb-6">
                    <p className="text-lg font-semibold">Cam kết sản phẩm</p>
                    <div className="mt-5 grid auto-rows-fr grid-cols-2 gap-3">
                      {getProduct.data.product_state && (
                        <div className="bg-accent rounded-md p-3">
                          <div className="text-primary-foreground mb-2.5 w-fit rounded-sm p-1 [background:linear-gradient(231deg,var(--primary-4)_-68%,var(--primary-7)_91%)] dark:[background:linear-gradient(231deg,var(--primary-7)_-68%,var(--primary-4)_91%)]">
                            <PackageCheck className="size-4.5" />
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {getProduct.data.product_state}
                          </div>
                        </div>
                      )}
                      {getProduct.data.warranty_information && (
                        <div className="bg-accent rounded-md p-3">
                          <div className="text-primary-foreground mb-2.5 w-fit rounded-sm p-1 [background:linear-gradient(231deg,var(--primary-4)_-68%,var(--primary-7)_91%)] dark:[background:linear-gradient(231deg,var(--primary-7)_-68%,var(--primary-4)_91%)]">
                            <ShieldCheck className="size-4.5" />
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {getProduct.data.warranty_information}
                          </div>
                        </div>
                      )}
                      {getProduct.data.included_accessories && (
                        <div className="bg-accent rounded-md p-3">
                          <div className="text-primary-foreground mb-2.5 w-fit rounded-sm p-1 [background:linear-gradient(231deg,var(--primary-4)_-68%,var(--primary-7)_91%)] dark:[background:linear-gradient(231deg,var(--primary-7)_-68%,var(--primary-4)_91%)]">
                            <PackageOpen className="size-4.5" />
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {getProduct.data.included_accessories}
                          </div>
                        </div>
                      )}

                      <div className="bg-accent rounded-md p-3">
                        <div className="text-primary-foreground mb-2.5 w-fit rounded-sm p-1 [background:linear-gradient(231deg,var(--primary-4)_-68%,var(--primary-7)_91%)] dark:[background:linear-gradient(231deg,var(--primary-7)_-68%,var(--primary-4)_91%)]">
                          <Tags className="size-4.5" />
                        </div>
                        {getProduct.data.tax_vat ? (
                          <div className="text-muted-foreground text-sm">
                            Giá sản phẩm <b>đã bao gồm thuế VAT</b>, giúp bạn yên tâm và dễ dàng
                            trong việc tính toán chi phí.
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-sm">
                            Giá sản phẩm <b>chưa bao gồm thuế VAT</b>.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:ml-15">
                  <div className="mr-3 mb-2">
                    <div className="text-xl font-semibold">{getProduct.data.name}</div>
                    <div className="text-muted-foreground truncate">
                      {getProduct.data.secondary_name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="inline-flex cursor-pointer items-center gap-1">
                      <span className="text-star">
                        <FaStar />
                      </span>
                      <span className="font-semibold">{getProduct.data.aggregate_rating}</span>
                      <span className="text-muted-foreground">{`(${formatToCompactNumber(getProduct.data.review_count)} đánh giá)`}</span>
                    </div>
                    <div className="h-4">
                      <Separator orientation="vertical" />
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Đã bán{" "}
                        <span className="text-foreground font-semibold">
                          {formatToCompactNumber(getProduct.data.quantity_sold)}
                        </span>
                      </span>
                    </div>
                    <div className="h-4">
                      <Separator orientation="vertical" />
                    </div>
                    <div
                      className="text-blue-7 flex cursor-pointer items-center gap-1"
                      onClick={onOpen}
                    >
                      <span>
                        <Cpu className="size-5.5" />
                      </span>
                      <span>Thông số kỹ thuật</span>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col gap-4">
                    <div className="bg-accent rounded-lg p-5">
                      <div className="w-fit text-sm font-medium">Giá sản phẩm</div>
                      <div className="flex items-end">
                        <div className="text-[28px] leading-9 font-semibold">
                          {formatCurrency(getProduct.data.price)}
                        </div>
                        {getProduct.data.original_price && (
                          <div>
                            <del className="text-muted-foreground ml-3">
                              {formatCurrency(getProduct.data.original_price)}
                            </del>
                            <span className="text-primary bg-primary/20 ml-3 rounded-sm px-1 text-sm">{`${getProduct.data.discount_percent}%`}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2.5 font-semibold">Phiên bản</div>
                      <div className="flex flex-wrap gap-3">
                        <div
                          className={cn(
                            "outline-border relative flex w-26 cursor-pointer flex-col items-center rounded-lg border-2 border-transparent p-3 text-center outline -outline-offset-1 md:w-32 md:p-4",
                            true && "outline-primary outline-2 -outline-offset-2",
                          )}
                        >
                          <strong className="text-xs md:text-sm">
                            {getProduct.data.related_name}
                          </strong>
                          <p className="text-primary mt-1 w-fit text-xs md:text-[13px]">
                            {formatCurrency(getProduct.data.price)}
                          </p>
                          <span className="border-primary absolute top-0 right-0 h-0 w-0 rounded-tr-sm border-t-20 border-l-20 border-l-transparent"></span>
                          <span className="text-primary-foreground absolute top-[1px] right-[1px]">
                            <Check width={10} height={10} />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 flex justify-between gap-3">
                      <Button
                        size="lg"
                        variant="outline"
                        startContent={<FaCartPlus className="size-7" />}
                        className="text-primary hover:text-primary dark:hover:bg-primary/20 border-primary dark:border-primary hover:bg-primary/20 h-14 flex-1 text-base transition-colors duration-300 dark:bg-transparent"
                      >
                        Thêm vào giỏ
                      </Button>
                      <Button size="lg" className="h-14 flex-1 text-base">
                        Mua ngay
                      </Button>
                    </div>
                    <div className="mt-4 mb-6 rounded-lg border">
                      <div className="bg-accent flex items-center justify-between rounded-t-lg border-b px-4 py-2.5">
                        <div className="text-lg font-semibold">Thông số kỹ thuật</div>
                        <button className="text-blue-7 text-sm font-medium" onClick={onOpen}>
                          Xem tất cả
                        </button>
                      </div>
                      <div className="px-4 py-3">
                        <Table>
                          <TableBody className="[&_tr:last-child]:border-b">
                            {getProduct.data.default_attributes.map((att, idx) => (
                              <TableRow className="border-dashed" key={idx}>
                                <TableCell className="text-muted-foreground w-3/10 py-2 pr-4 font-medium whitespace-normal">
                                  {att.name}
                                </TableCell>
                                <TableCell className="w-full px-4 py-2 whitespace-pre-wrap">
                                  {att.value}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-3 grid md:grid-cols-3">
                <div
                  id="cpsContent"
                  className="bg-accent desc-content rounded-xl p-4 text-justify md:col-span-2"
                >
                  <div className="mb-4 text-xl font-semibold">Đặc điểm nổi bật</div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(getProduct.data.highlight_features),
                    }}
                    className="bg-background rounded-md p-4 text-sm [&>ul]:list-disc [&>ul]:pl-5"
                  ></div>
                  <div className="my-4 text-xl font-semibold">Mô tả sản phẩm</div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(getProduct.data.description),
                    }}
                    className="bg-background rounded-md p-4 [&>ul]:list-disc [&>ul]:pl-5"
                  ></div>
                </div>
              </div>
              <div className="h-[2000px]">haha</div>
            </div>
          )
        )}
      </div>

      <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
        <TechnologyDrawer data={getProduct.data?.attribute_items || []} />
      </Drawer>
    </>
  )
}
