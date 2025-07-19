import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { useGetCategoryTree } from "@/modules/category/services/getCategory"
import Field from "@/components/core/field"
import { useGetAttributes } from "../services/getAttributes"
import { useEffect, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod/v4"
import { InputType } from "@/constants/inputType"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import CreateFormFooter from "../components/CreateFormFooter"
import { CreateProductDto, useCreateProduct } from "../services/createProduct"
import { toast } from "sonner"
import CreateFormVariation from "../components/CreateFormVariation"
import { useGetProductGroup } from "../services/getProductGroup"

const attributeValueSchema = z.object({
  option_id: z.number().optional(),
  raw_value: z.string().optional(),
})

const attributeSchema = z
  .object({
    attribute_id: z.number(),
    attribute_name: z.string(),
    input_type: z.number(),
    is_required: z.boolean(),
    attribute_values: z.preprocess((val) => {
      if (Array.isArray(val) && val.every((v) => typeof v === "number")) {
        return val.map((id) => ({ option_id: id }))
      }
      return val
    }, z.array(attributeValueSchema)),
  })
  .check((ctx) => {
    if (ctx.value.is_required) {
      const message = [InputType.TEXT_FIELD, InputType.TEXT_AREA].includes(ctx.value.input_type)
        ? `Vui lòng điền vào ${ctx.value.attribute_name}`
        : `Vui lòng chọn ${ctx.value.attribute_name}`

      switch (ctx.value.input_type) {
        case (InputType.TEXT_FIELD, InputType.TEXT_AREA):
          if (!ctx.value.attribute_values?.some((v) => v.raw_value?.trim())) {
            ctx.issues.push({
              code: "custom",
              input: ctx.value,
              message,
              path: ["attribute_values.0.raw_value"],
            })
          }
          break

        case InputType.DROPDOWN:
          if (!ctx.value.attribute_values?.some((v) => v.option_id)) {
            ctx.issues.push({
              code: "custom",
              input: ctx.value,
              message,
              path: ["attribute_values.0.option_id"],
            })
          }
          break

        default:
          if (!ctx.value.attribute_values?.length) {
            ctx.issues.push({
              code: "custom",
              input: ctx.value,
              message,
              path: ["attribute_values"],
            })
          }
      }
    }
  })

const imageSchema = z.object({
  key: z.string(),
  url: z.string(),
})

const variantValueSchema = z.object({
  value_id: z.number().default(0),
  custom_value: z.string().optional().default(""),
})

const variationSchema = z
  .object({
    type_id: z.number().default(0),
    custom_value: z.string().optional().default(""),
    value_list: z.preprocess((val) => {
      if (Array.isArray(val) && val.every((v) => typeof v === "number")) {
        return val.map((id) => ({ value_id: id, custom_value: "" }))
      }
      return val
    }, z.array(variantValueSchema)),
  })
  .check((ctx) => {
    if (ctx.value.value_list.length === 0) {
      ctx.issues.push({
        code: "custom",
        input: ctx.value,
        message: "Không được để trống",
        path: ["value_list"],
      })
    }
    if (!ctx.value.custom_value.trim() && !ctx.value.type_id) {
      ctx.issues.push({
        code: "custom",
        input: ctx.value,
        message: "Không được để trống",
        path: ["id"],
      })
    }
  })

const variantSchema = z.object({
  variant_id: z.number().default(0),
  original_price: z.preprocess((val) => {
    if (!val) return undefined
    return val
  }, z.coerce.number().min(1000, "Giá trị phải ít nhất 1.000 VNĐ").optional()),
  price: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : Number(val)),
    z
      .number({
        error: (issue) => {
          if (issue.input === undefined) return "Không được để trống"
        },
      })
      .min(1000, {
        error: "Giá trị phải ít nhất 1.000 VNĐ",
      }),
  ),
  stock: z
    .preprocess(
      (val) => (typeof val === "string" && val.trim() === "" ? undefined : Number(val)),
      z.number({
        error: (issue) => {
          if (issue.input === undefined) return "Không được để trống"
        },
      }),
    )
    .default(0),
  index_map: z.array(z.number()).default([0]),
  image: imageSchema.optional(),
})

const formSchema = z
  .object({
    images: z.array(imageSchema).nonempty({
      error: "Vui lòng tải lên ít nhất một hình ảnh sản phẩm",
    }),
    name: z.string().min(1, { error: "Tên sản phẩm không được để trống" }).max(120, {
      error: "Tên sản phẩm không được vượt quá 120 ký tự",
    }),
    secondary_name: z.string().optional(),
    related_name: z.string().optional(),
    category_ids: z.array(z.array(z.number())).nonempty("Vui lòng chọn ít nhất một danh mục"),
    description: z.string().min(1, "Mô tả sản phẩm không được để trống"),
    highlight_features: z.string().min(1, "Đặc điểm nổi bật không được để trống"),
    attributes: z.array(attributeSchema),
    variant_values: z.array(variantSchema),
    variation_list: z.array(variationSchema),

    product_state: z.string().optional(),
    included_accessories: z.string().optional(),
    warranty_information: z.string().optional(),
    tax_vat: z.coerce.boolean().optional(),
    group_id: z.number().optional(),
  })
  .refine((data) => !(data.group_id && !data.related_name), {
    message: "Đã chọn nhóm sản phẩm, không được để trống",
    path: ["related_name"],
  })

function getIndex() {
  let index = 0
  return () => {
    return index++
  }
}

export type FormProductValues = z.input<typeof formSchema>

export default function CreatProduct() {
  const { data: categoryOptions } = useGetCategoryTree()
  const getProductGroup = useGetProductGroup()
  const { mutate, data: attributesData, isPending } = useGetAttributes()
  const createProduct = useCreateProduct()

  const targetRef = useRef<HTMLDivElement>(null)

  const getIndexAuto = getIndex()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: [],
      name: "",
      category_ids: [],
      description: "",
      highlight_features: "",
      attributes: [],
      related_name: undefined,
      tax_vat: "true",
      variant_values: [
        {
          variant_id: 0,
          original_price: "",
          price: "",
          stock: 0,
          index_map: [0],
        },
      ],
    },
  })

  const { replace } = useFieldArray({
    control: form.control,
    name: "attributes",
  })

  const categoriesField = form.watch("category_ids")

  useEffect(() => {
    if (categoriesField && categoriesField.length > 0) {
      mutate({ category_ids: categoriesField.map((item) => item.at(-1)!) })
    }
  }, [categoriesField])

  useEffect(() => {
    if (attributesData) {
      const attributes = attributesData
        .flatMap((attGroup) => attGroup.attributes)
        .map((att) => ({
          attribute_id: att.id,
          attribute_name: att.name,
          input_type: att.input_type,
          is_required: att.is_required,
          attribute_values: [],
        }))
      replace(attributes)
    }
  }, [attributesData])

  const onSubmit: SubmitHandler<z.output<typeof formSchema>> = (data) => {
    const formattedData: CreateProductDto = {
      ...data,
      category_ids: [...new Set(data.category_ids.flat())],
      attributes: data.attributes?.filter(
        (att) =>
          att.attribute_values.length > 0 &&
          att.attribute_values?.every((v) => v.raw_value || v.option_id),
      ),
    }

    createProduct.mutate(formattedData, {
      onSuccess: () => {
        form.reset()
        toast.success("Tạo sản phẩm thành công")
      },
    })
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div ref={targetRef} className="relative mx-auto max-w-5xl space-y-4 overflow-y-auto">
            <Card id="basic-info" className="rounded-md">
              <CardHeader className="gap-0">
                <CardTitle className="text-xl">Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Field
                  isRequired
                  name="images"
                  maxFiles={0}
                  maxSize={10}
                  t="input-upload-image"
                  label="Hình ảnh sản phẩm"
                  description="Ảnh đầu tiên sẽ làm ảnh bìa của sản phẩm"
                />
                <Field
                  isRequired
                  name="name"
                  t="input"
                  label="Tên sản phẩm"
                  size="lg"
                  placeholder="Tên sản phẩm + Thương hiệu + Model + Mã"
                />
                <Field
                  name="category_ids"
                  isRequired
                  multiple
                  allowClear={false}
                  t="input-cascader"
                  options={categoryOptions}
                  label="Danh mục"
                  filedNames={{
                    value: "id",
                    label: "name",
                  }}
                  description="Vui lòng chọn danh mục thuộc cấp cuối cùng"
                  cascaderValueProps={{ placeholder: "Chọn danh mục" }}
                  cascaderTriggerProps={{ className: "w-full", size: "lg" }}
                />
              </CardContent>
            </Card>

            <Card id="product-description" className="rounded-md">
              <CardHeader className="gap-0">
                <CardTitle
                  className={cn("text-xl", !categoriesField.length && "text-muted-foreground")}
                >
                  Mô tả sản phẩm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {categoriesField && categoriesField.length > 0 ? (
                  <>
                    <Field
                      isRequired
                      name="description"
                      t="input-editor"
                      label="Mô tả chi tiết"
                      init={{
                        min_height: 500,
                        max_height: 600,
                      }}
                    />
                    <Field
                      isRequired
                      name="highlight_features"
                      t="input-editor"
                      label="Đặc điểm nổi bật"
                      init={{
                        toolbar: "bullist numlist",
                        plugins: "lists",
                        menubar: false,
                        contextmenu: false,
                        automatic_uploads: false,
                        paste_data_images: false,
                        paste_block_drop: false,
                        min_height: 300,
                        max_height: 300,
                      }}
                      description="Vui lòng liệt kê dưới dạng danh sách, đặc điểm nổi bật sẽ được hiển thị trên danh sách ảnh tại trang chi tiết sản phẩm"
                    />
                  </>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    Có thể điều chỉnh sau khi chọn danh mục
                  </div>
                )}
              </CardContent>
            </Card>

            {categoriesField && categoriesField.length > 0 && (
              <Card id="technical-information" className="rounded-md">
                <CardHeader className="gap-0">
                  <CardTitle className="text-xl">Thông số kỹ thuật</CardTitle>
                </CardHeader>
                <CardContent className="space-y-7">
                  {isPending ? (
                    <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                      {Array(10)
                        .fill("")
                        .map((_, idx) => (
                          <Skeleton key={idx} className="h-10 rounded-md" />
                        ))}
                    </div>
                  ) : (
                    attributesData?.map((attributeGroup, idx) => (
                      <div key={idx}>
                        <div className="mb-6.5 flex items-center whitespace-nowrap">
                          <div className="bg-border h-[1px] w-full"></div>
                          <span className="px-3 text-sm font-semibold">
                            {attributeGroup.is_filter ? "Thuộc tính bộ lọc" : attributeGroup.name}
                          </span>
                          <div className="bg-border h-[1px] w-full"></div>
                        </div>
                        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6">
                          {attributeGroup.attributes.map((att) => {
                            if (att.input_type === InputType.TEXT_FIELD) {
                              return (
                                <Field
                                  key={att.id}
                                  isRequired={att.is_required}
                                  name={`attributes.${getIndexAuto()}.attribute_values.0.raw_value`}
                                  t="input"
                                  label={att.name}
                                  size="lg"
                                  placeholder="Vui lòng điền vào"
                                />
                              )
                            }

                            if (att.input_type === InputType.TEXT_AREA) {
                              return (
                                <Field
                                  key={att.id}
                                  isRequired={att.is_required}
                                  name={`attributes.${getIndexAuto()}.attribute_values.0.raw_value`}
                                  t="input-textarea"
                                  label={att.name}
                                  size="lg"
                                  placeholder="Vui lòng điền vào"
                                />
                              )
                            }

                            if (att.input_type === InputType.DROPDOWN) {
                              return (
                                <Field
                                  key={att.id}
                                  isRequired={att.is_required}
                                  allowClear={!att.is_required}
                                  name={`attributes.${getIndexAuto()}.attribute_values.0.option_id`}
                                  t="input-my-select"
                                  label={att.name}
                                  size="lg"
                                  placeholder="Vui lòng chọn"
                                  searchPlaceholder="Nhập từ khóa để tìm kiếm"
                                  notFoundContent="Không tìm thấy"
                                  options={att.options}
                                  fieldNames={{ label: "name", value: "id" }}
                                />
                              )
                            }

                            if (att.input_type === InputType.MULTI_SELECT) {
                              return (
                                <Field
                                  key={att.id}
                                  isRequired={att.is_required}
                                  allowClear={!att.is_required}
                                  name={`attributes.${getIndexAuto()}.attribute_values`}
                                  t="input-my-select"
                                  label={att.name}
                                  size="lg"
                                  mode="multiple"
                                  placeholder="Vui lòng chọn"
                                  searchPlaceholder="Nhập từ khóa để tìm kiếm"
                                  notFoundContent="Không tìm thấy"
                                  options={att.options}
                                  fieldNames={{ label: "name", value: "id" }}
                                />
                              )
                            }
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}

            <Card id="sales-information" className="rounded-md">
              <CardHeader className="gap-0">
                <CardTitle
                  className={cn("text-xl", !categoriesField.length && "text-muted-foreground")}
                >
                  Thông tin bán hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                {categoriesField && categoriesField.length > 0 ? (
                  <CreateFormVariation />
                ) : (
                  <div className="text-muted-foreground text-sm">
                    Có thể điều chỉnh sau khi chọn danh mục
                  </div>
                )}
              </CardContent>
            </Card>

            <Card id="other-information" className="rounded-md">
              <CardHeader className="gap-0">
                <CardTitle
                  className={cn("text-xl", !categoriesField.length && "text-muted-foreground")}
                >
                  Thông tin khác
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                {categoriesField && categoriesField.length > 0 ? (
                  <>
                    <Field
                      t="input-textarea"
                      name="product_state"
                      label="Tình trạng sản phẩm"
                      placeholder="Nguyên hộp, đầy đủ phụ kiện"
                    />
                    <Field
                      t="input-textarea"
                      name="included_accessories"
                      label="Phụ kiện kèm theo"
                      placeholder="Máy, sạc, sách hướng dẫn"
                    />
                    <Field
                      t="input-textarea"
                      name="warranty_information"
                      label="Thông tin bảo hành"
                      placeholder="Bảo hành 12 tháng, 1 đổi 1"
                    />
                    <Field
                      t="radio-group"
                      options={[
                        { label: "Có", value: true },
                        { label: "Không", value: false },
                      ]}
                      label="Giá sản phẩm có gồm thuế VAT không?"
                      name="tax_vat"
                      size="lg"
                    />
                    <Field
                      name="secondary_name"
                      t="input"
                      label="Tên phụ"
                      size="lg"
                      placeholder="CPU + Dung lượng RAM + Dung lượng ổ cứng + Độ phân giải màn hình + HĐH + Màu"
                    />
                    <div></div>
                    <Field
                      name="group_id"
                      t="input-my-select"
                      label="Nhóm sản phẩm"
                      size="lg"
                      placeholder="Chọn nhóm sản phẩm"
                      description="Nếu chọn nhóm sản phẩm, bắt buộc nhập tên phiên bản"
                      options={getProductGroup.data || []}
                      fieldNames={{ label: "name", value: "id" }}
                      searchPlaceholder="Nhập từ khóa để tìm kiếm"
                      allowClear
                    />
                    <Field
                      name="related_name"
                      t="input"
                      label="Tên phiên bản"
                      size="lg"
                      placeholder="CPU + RAM + Ổ cứng + Màn hình"
                      description="Dùng để hiển thị ở các lựa chọn phiên bản của sản phẩm"
                    />
                  </>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    Có thể điều chỉnh sau khi chọn danh mục
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <CreateFormFooter targetRef={targetRef} isLoading={createProduct.isPending} />
        </form>
      </Form>
    </>
  )
}
