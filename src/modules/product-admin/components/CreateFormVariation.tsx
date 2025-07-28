import { useEffect, useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { useGetVariantType } from "../services/getVariantType"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"
import Field from "@/components/core/field"
import { FormProductValues } from "../pages/CreatUpdateProduct"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProductDetail } from "../services/getProductDetail"

interface Props {
  variationList?: ProductDetail["variation_list"]
  variantValues?: ProductDetail["variant_values"]
}

export default function CreateFormVariation({ variationList, variantValues }: Props) {
  const [isVariation, setIsVariation] = useState<boolean>(false)

  const getVariantType = useGetVariantType()

  const { control, watch } = useFormContext<FormProductValues>()

  const {
    fields: variationListFields,
    append: appendVariation,
    remove: removeVariation,
    replace: replaceVariation,
  } = useFieldArray({
    control,
    name: "variation_list",
  })
  const {
    fields: variantValueFields,
    remove: removeVariantValue,
    append: appendVariantValue,
    replace: replaceVariantValue,
  } = useFieldArray({
    control,
    name: "variant_values",
  })

  const selectedVariantType = watch("variation_list")

  useEffect(() => {
    if (selectedVariantType?.[0]?.value_list) {
      const newVariantValues = []
      let indexVariantValues = 0

      const variantItem = selectedVariantType[0].value_list as any[]
      for (let j = 0; j < variantItem.length; j++) {
        newVariantValues.push({
          variant_id: variantValueFields[indexVariantValues]?.variant_id || 0,
          price: variantValueFields[indexVariantValues]?.price || "",
          original_price: variantValueFields[indexVariantValues]?.original_price || "",
          stock: variantValueFields[indexVariantValues]?.stock || 0,
          image: variantValueFields[indexVariantValues]?.image || undefined,
          index_map: variantValueFields[indexVariantValues]?.index_map || [j],
        })
        indexVariantValues++
      }

      replaceVariantValue(newVariantValues)
    }
  }, [selectedVariantType?.[0]?.value_list, replaceVariantValue])

  useEffect(() => {
    if (variationList) {
      setIsVariation(true)
      replaceVariation(
        variationList.map((item) => ({
          ...item,
          value_list: item.value_list.flatMap((v) => v.value_id),
        })),
      )
      if (variantValues) {
        replaceVariantValue(variantValues as FormProductValues["variant_values"])
      }
    }
  }, [variationList])

  return (
    <div
      className={cn("space-y-6", !isVariation && "md:grid md:grid-cols-2 md:gap-6 md:space-y-0")}
    >
      {!isVariation && (
        <>
          <div className="col-span-2">
            <div className="flex flex-col gap-2">
              <Label className="mb-2">Phân loại sản phẩm</Label>
              <Button
                type="button"
                className="text-primary hover:border-primary hover:bg-primary/10 hover:text-primary dark:hover:border-primary w-fit border-dashed"
                variant="outline"
                startContent={<Plus />}
                onClick={() => {
                  removeVariantValue()
                  appendVariation({
                    type_id: undefined,
                    custom_value: "",
                    value_list: [],
                  })
                  appendVariantValue({
                    variant_id: 0,
                    price: "",
                    original_price: "",
                    stock: 0,
                    image: undefined,
                    index_map: [0],
                  })
                  setIsVariation(true)
                }}
              >
                Thêm nhóm phân loại
              </Button>
            </div>
          </div>
          <Field
            size="lg"
            isRequired
            name="variant_values.0.price"
            t="input-number"
            label="Giá"
            startContent={
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">₫</span>
                <span className="bg-border w-[1px] group-data-[size=lg]:h-5 group-data-[size=md]:h-4"></span>
              </div>
            }
            placeholder="Nhập vào"
            description="Giá hiện tại của sản phẩm, nếu sản phẩm đang giảm giá thì đây là giá sau khi đã giảm"
          />
          <Field
            size="lg"
            name="variant_values.0.original_price"
            t="input-number"
            label="Giá gốc"
            startContent={
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">₫</span>
                <span className="bg-border w-[1px] group-data-[size=lg]:h-5 group-data-[size=md]:h-4"></span>
              </div>
            }
            placeholder="Tùy chọn"
            description="Giá ban đầu của sản phẩm, bỏ trống nếu sản phẩm không giảm giá"
          />
          <Field
            size="lg"
            isRequired
            name="variant_values.0.stock"
            t="input-number"
            label="Kho hàng"
          />
        </>
      )}
      {isVariation && (
        <>
          <div className="flex flex-col gap-3">
            <Label>Phân loại sản phẩm</Label>
            <div className="space-y-4">
              {variationListFields.map((field, index) => (
                <div key={field.id} className="bg-accent relative space-y-4 rounded-lg p-4">
                  <span
                    className="text-muted-foreground hover:text-foreground absolute top-3 right-3 cursor-pointer"
                    onClick={() => {
                      setIsVariation(false)
                      removeVariation()
                      removeVariantValue()
                    }}
                  >
                    <X className="size-5" />
                  </span>
                  <Field
                    name={`variation_list.${index}.type_id`}
                    t="input-my-select"
                    size="sm"
                    label="Tên phân loại"
                    placeholder="Vui lòng chọn, ví dụ: Màu sắc..."
                    notFoundContent="Không có dữ liệu"
                    searchPlaceholder="Nhập từ khóa để tìm kiếm"
                    fieldNames={{ label: "name", value: "id" }}
                    className="bg-background md:w-1/2"
                    labalPlacement="outside-left"
                    allowClear
                    labelWidth={150}
                    options={
                      getVariantType.data?.map((v) => ({
                        id: v.id,
                        name: v.name,
                      })) || []
                    }
                  />
                  <Field
                    name={`variation_list.${index}.value_list`}
                    t="input-my-select"
                    size="sm"
                    mode="multiple"
                    labelWidth={150}
                    placeholder="Tùy chọn, ví dụ: Màu sắc..."
                    labalPlacement="outside-left"
                    label="Các giá trị"
                    allowClear
                    className="bg-background md:w-1/2"
                    notFoundContent="Không có dữ liệu"
                    searchPlaceholder="Nhập từ khóa để tìm kiếm"
                    fieldNames={{ label: "name", value: "id" }}
                    options={
                      getVariantType.data?.find(
                        (v) => v.id === selectedVariantType?.[index].type_id,
                      )?.options || []
                    }
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Label>Danh sách phân loại</Label>
            <div></div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-accent hover:bg-accent transition-none [&>th]:not-last:border-r">
                    <TableHead className="text-center">Ảnh</TableHead>
                    {selectedVariantType?.map((item, index) => {
                      const nameVarType = getVariantType.data?.find(
                        (v) => v.id === item.type_id,
                      )?.name
                      return (
                        <TableHead className="text-center" key={index}>
                          {nameVarType || `Phân loại ${index + 1}`}
                        </TableHead>
                      )
                    })}
                    <TableHead className="before:text-primary-6 text-center before:me-1 before:content-['*']">
                      Giá
                    </TableHead>
                    <TableHead className="text-center">Giá gốc</TableHead>
                    <TableHead className="before:text-primary-6 text-center before:me-1 before:content-['*']">
                      Kho hàng
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variantValueFields.map((field, index) => {
                    return (
                      <TableRow key={field.id} className="[&>td]:not-last:border-r">
                        <TableCell className="flex h-full min-h-29.5 flex-col items-center justify-center p-4">
                          <Field
                            name={`variant_values.${index}.image`}
                            t="input-upload-image"
                            multiple={false}
                            maxFiles={1}
                            showUploadTitle={false}
                            disabled={true}
                            wrapperClass="size-13"
                            className="text-primary size-13"
                          />
                        </TableCell>
                        {field.index_map?.map((item, idx) => {
                          const variantTypeId = selectedVariantType?.[idx]?.type_id
                          const variantValueId = (selectedVariantType?.[idx]?.value_list as [])?.[
                            item
                          ]

                          return (
                            <TableCell key={idx} className="p-4 text-center">
                              <div>
                                {getVariantType.data
                                  ?.find((v) => v.id === variantTypeId)
                                  ?.options.find((o) => o.id === variantValueId)?.name || ""}
                              </div>
                            </TableCell>
                          )
                        })}
                        <TableCell className="p-4 align-top">
                          <Field
                            size="sm"
                            name={`variant_values.${index}.price`}
                            t="input-number"
                            placeholder="Giá"
                          />
                        </TableCell>
                        <TableCell className="p-4 align-top">
                          <Field
                            name={`variant_values.${index}.original_price`}
                            t="input-number"
                            size="sm"
                            placeholder="Giá gốc"
                          />
                        </TableCell>
                        <TableCell className="p-4 align-top">
                          <Field
                            name={`variant_values.${index}.stock`}
                            t="input-number"
                            size="sm"
                            placeholder="Giá"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
