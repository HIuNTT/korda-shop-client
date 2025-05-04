import Field from "@/components/core/field"
import { Button } from "@/components/ui/button"
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { useSignUpStore } from "@/stores/sign-up"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useSendVerifyCode } from "../../services/verifyCode"
import { zodResolver } from "@hookform/resolvers/zod"
import { useExistUser } from "../../services/signUp"

const formSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Vui lòng điền vào mục này." })
    .email({ message: "Email không hợp lệ" }),
})

export default function EmailForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const { incStep, setData } = useSignUpStore()
  const { isPending, mutateAsync } = useSendVerifyCode()
  const existUser = useExistUser()

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { existed } = await existUser.mutateAsync(data)
    if (existed) {
      form.setError("email", { message: "Email đã tồn tại! Vui lòng sử dụng email khác." })
      return
    }
    await mutateAsync(data)
    setData(data)
    incStep()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl">Đăng ký</DialogTitle>
        <DialogDescription>Tạo tài khoản Korda của bạn</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-6">
            <Field t="input" name="email" placeholder="abc@gmail.com" label="Email" size="lg" />
            <Button type="submit" isLoading={isPending || existUser.isPending}>
              Tiếp tục
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
