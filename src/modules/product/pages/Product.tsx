import { Navigate, useNavigate, useParams, useSearchParams } from "react-router"
import { ProductParams } from "../route"
import { useGetProduct } from "../services/getProduct"
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
import TechnologyDrawer, { TechDrawerRef } from "../components/TechnologyDrawer"
import { paths } from "@/constants/paths"
import { useMemo, useRef } from "react"
import ParagraphExpandable from "../components/ParagraphExpandable"
import { useUser } from "@/stores/user"
import { Dialog } from "@/components/ui/dialog"
import LoginDialog from "@/modules/auth/components/LoginDialogl"
import SignUpDialog from "@/modules/auth/components/sign-up"
import { useDisclosure } from "@/hooks/use-disclosure"
import { toast } from "sonner"
import { useAddToCart } from "@/modules/cart/services/addToCart"
import { queryClient } from "@/configs/queryClient"
import Breadcrumbs from "@/components/core/Breadcrumbs"
import { useCart } from "@/stores/cart"

export default function Product() {
  const { slug } = useParams<keyof ProductParams>()
  const [variantIdParams, setVariantIdParams] = useSearchParams()

  const techDrawerRef = useRef<TechDrawerRef>(null)

  const { user } = useUser()
  const { selectedIds } = useCart()

  const disclosureLogin = useDisclosure()
  const disclosureSignUp = useDisclosure()

  const navigate = useNavigate()

  if (!slug) {
    return <Navigate to="/" replace />
  }

  const getProduct = useGetProduct(slug)
  const addToCart = useAddToCart()
  const buyNow = useAddToCart()

  const currVariant = useMemo(() => {
    if (getProduct.data) {
      const value = getProduct.data?.variants.find(
        (variant) => variant.id.toString() === variantIdParams.get("variant_id"),
      )
      if (variantIdParams.get("variant_id") === null) {
        return getProduct.data?.variants.find((variant) => variant.is_default)
      }
      if (!value && variantIdParams.get("variant_id")) {
        navigate(`${paths.product.getHref()}/${getProduct.data?.slug}`, { replace: true })
      }
      return value
    }
  }, [getProduct.data?.variants, variantIdParams])

  const handleClickVersion = (slug: string) => {
    if (slug === getProduct.data?.slug) return
    navigate(`${paths.product.getHref()}/${slug}`)
  }

  const handleClickVariant = (variantId: number) => {
    if (variantId === currVariant?.id) return
    setVariantIdParams({ variant_id: variantId.toString() })
  }

  const handleAddToCart = (item_id: number, quantity: number = 1) => {
    addToCart.mutate(
      { item_id, quantity },
      {
        onSuccess: () => {
          queryClient.refetchQueries({
            queryKey: ["count-item-in-cart"],
          })
          toast.success("Thêm vào giỏ hàng thành công")
        },
      },
    )
  }

  const handleClickBuyNow = (item_id: number, quantity: number = 1) => {
    buyNow.mutate(
      { item_id, quantity },
      {
        onSuccess: (data) => {
          queryClient.refetchQueries({
            queryKey: ["count-item-in-cart"],
          })
          toast.success("Thêm vào giỏ hàng thành công")
          selectedIds.add(data.id)
          navigate(paths.cart.getHref())
        },
      },
    )
  }

  return (
    <div className="mx-auto max-w-[1200px] max-[1200px]:px-4">
      <div>
        {/* Breadcrumbs */}
        <Breadcrumbs
          isLoading={getProduct.isLoading}
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
                <div className="mt-5 h-max md:sticky md:top-[129px]">
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
                <div className="mt-4 md:ml-15">
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
                      onClick={() => techDrawerRef.current?.onOpen()}
                    >
                      <span>
                        <Cpu className="size-5.5" />
                      </span>
                      <span>Thông số kỹ thuật</span>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col gap-4">
                    <div className="rounded-lg border border-transparent p-5 transition-all [background:linear-gradient(to_top_right,#fffbf8,#fffbeb)_padding-box,linear-gradient(to_top_right,#fff2bd,#ffcd00)_border-box] dark:[background:linear-gradient(to_top_right,#454545,#000)_padding-box,linear-gradient(to_top_right,var(--primary-6),var(--primary-3))_border-box]">
                      <div className="w-fit text-sm font-medium">Giá sản phẩm</div>
                      <div className="flex items-end">
                        <div className="text-[28px] leading-9 font-semibold">
                          {formatCurrency(currVariant?.price || getProduct.data.price)}
                        </div>
                        {getProduct.data.original_price && (
                          <div>
                            <del className="text-muted-foreground ml-3">
                              {formatCurrency(
                                currVariant?.original_price || getProduct.data.original_price,
                              )}
                            </del>
                            <span className="text-primary bg-primary/20 ml-3 rounded-sm px-1 text-sm">{`${currVariant?.discount_percent || getProduct.data.discount_percent}%`}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {getProduct.data.product_versions && (
                      <div>
                        <div className="mb-2.5 font-semibold">Phiên bản</div>
                        <div className="flex flex-wrap gap-3">
                          {getProduct.data.product_versions.map((version) => (
                            <div
                              key={version.slug}
                              className={cn(
                                "outline-border relative flex w-26 cursor-pointer flex-col items-center rounded-lg border-2 border-transparent p-3 text-center outline -outline-offset-1 md:w-32 md:p-4",
                                version.slug === getProduct.data.slug &&
                                  "outline-primary outline-2 -outline-offset-2",
                              )}
                              onClick={() => handleClickVersion(version.slug)}
                            >
                              <strong className="text-xs md:text-sm">{version.name}</strong>
                              <p className="text-primary mt-1 w-fit text-xs md:text-[13px]">
                                {formatCurrency(version.price)}
                              </p>
                              {version.slug === getProduct.data.slug && (
                                <>
                                  <span className="border-primary absolute top-0 right-0 h-0 w-0 rounded-tr-sm border-t-20 border-l-20 border-l-transparent"></span>
                                  <span className="text-primary-foreground absolute top-[1px] right-[1px]">
                                    <Check width={10} height={10} />
                                  </span>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {getProduct.data.variants.length > 0 && getProduct.data.variants[0].color && (
                      <div>
                        <div className="mb-2.5 font-semibold">Màu sắc</div>
                        <div className="grid grid-cols-2 gap-3 min-[541px]:grid-cols-3 min-[768px]:grid-cols-2 min-[1029px]:grid-cols-3">
                          {getProduct.data.variants.map((variant) => (
                            <div
                              key={variant.id}
                              className={cn(
                                "outline-border relative flex cursor-pointer flex-col items-start rounded-lg border-2 border-transparent text-center outline -outline-offset-1",
                                variant.id === currVariant?.id &&
                                  "outline-primary outline-2 -outline-offset-2",
                              )}
                              onClick={() => handleClickVariant(variant.id)}
                            >
                              <div className="flex w-full items-center justify-start gap-2 p-3 text-xs min-[1200px]:text-sm">
                                <img
                                  src={variant.image_url}
                                  alt={`${getProduct.data.name} - ${variant.color}`}
                                  width={40}
                                  height={40}
                                />
                                <div className="flex flex-col">
                                  <strong className="text-left">{variant.color}</strong>
                                  <span className="text-left">{formatCurrency(variant.price)}</span>
                                </div>
                              </div>
                              {variant.id === currVariant?.id && (
                                <>
                                  <span className="border-primary absolute top-0 right-0 h-0 w-0 rounded-tr-sm border-t-20 border-l-20 border-l-transparent"></span>
                                  <span className="text-primary-foreground absolute top-[1px] right-[1px]">
                                    <Check width={10} height={10} />
                                  </span>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {currVariant && currVariant?.stock > 0 && (
                      <div className="mt-5 flex justify-between gap-3">
                        <Button
                          size="lg"
                          variant="outline"
                          startContent={<FaCartPlus className="size-7" />}
                          className="text-primary hover:text-primary dark:hover:bg-primary/20 border-primary dark:border-primary hover:bg-primary/20 h-14 flex-1 text-base transition-colors duration-300 dark:bg-transparent"
                          onClick={() => {
                            if (!user.id) {
                              toast("Vui lòng đăng nhập để tiếp tục")
                              disclosureLogin.onOpen()
                              return
                            }
                            handleAddToCart(currVariant.id)
                          }}
                          isLoading={addToCart.isPending}
                        >
                          Thêm vào giỏ
                        </Button>
                        <Button
                          size="lg"
                          className="h-14 flex-1 text-base"
                          onClick={() => {
                            if (!user.id) {
                              toast("Vui lòng đăng nhập để tiếp tục")
                              disclosureLogin.onOpen()
                              return
                            }
                            handleClickBuyNow(currVariant.id)
                          }}
                          isLoading={buyNow.isPending}
                        >
                          Mua ngay
                        </Button>
                      </div>
                    )}
                    <div className="mt-4 mb-6 rounded-lg border">
                      <div className="bg-accent flex items-center justify-between rounded-t-lg border-b px-4 py-2.5">
                        <div className="text-lg font-semibold">Thông số kỹ thuật</div>
                        <button
                          className="text-blue-7 text-sm font-medium"
                          onClick={() => techDrawerRef.current?.onOpen()}
                        >
                          Xem tất cả
                        </button>
                      </div>
                      <div className="px-4 py-3">
                        <Table>
                          <TableBody>
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
                <div className="bg-accent rounded-xl md:col-span-2">
                  <ParagraphExpandable>
                    <div id="cpsContent" className="desc-content p-4 pb-0">
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
                  </ParagraphExpandable>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <TechnologyDrawer ref={techDrawerRef} data={getProduct.data?.attribute_items || []} />

      <Dialog open={disclosureLogin.isOpen} onOpenChange={disclosureLogin.onOpenChange}>
        <LoginDialog onClose={disclosureLogin.onClose} onOpenSignUp={disclosureSignUp.onOpen} />
      </Dialog>

      <Dialog open={disclosureSignUp.isOpen} onOpenChange={disclosureSignUp.onOpenChange}>
        <SignUpDialog onClose={disclosureSignUp.onClose} onOpenLogin={disclosureLogin.onOpen} />
      </Dialog>
    </div>
  )
}
