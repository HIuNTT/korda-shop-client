import Field from "@/components/core/field"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cascader, CascaderContent, CascaderTrigger, CascaderValue } from "@/components/ui/cascader"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"

interface Option {
  value: string
  label: string
  children?: Option[]
}

const options: Option[] = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
]

export default function CreatProduct() {
  const form = useForm()

  return (
    <>
      <div className="text-xl font-semibold">Thêm sản phẩm mới</div>
      <Form {...form}>
        <form>
          <Card className="max-w-6xl">
            <CardHeader>
              <CardTitle>Thông tin cả bản</CardTitle>
            </CardHeader>
            <CardContent>
              <Field
                errorMessage="Vyui klioánạkóao sdffa"
                isRequired
                name="name"
                t="input"
                label="Tên sản phẩm"
              />
              <Field
                labalPlacement="outside-left"
                isRequired
                labelSpan={2}
                wrapperSpan={10}
                name="name2"
                t="input"
                label="Danh mục"
                errorMessage="Vui lòng chọn danh mục cho sản phẩm này"
              />
              <Field
                isRequired
                labalPlacement="outside-left"
                name="name3"
                t="input-otp"
                maxLength={6}
                label="Giá sản phẩm"
                description="Giá sản phẩm này sẽ được hiển thị trên trang web"
              />

              <Cascader options={options} onChange={(value) => console.log(value)}>
                <CascaderTrigger>
                  <CascaderValue placeholder="Chọn danh mục" />
                </CascaderTrigger>
                <CascaderContent />
              </Cascader>
            </CardContent>
          </Card>
        </form>
      </Form>
    </>
  )
}
