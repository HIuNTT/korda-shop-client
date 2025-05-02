import Field from "@/components/core/field"
import { Button } from "@/components/ui/button"
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { useSignUpStore } from "@/stores/sign-up"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { SignUpDto, useSignUp } from "../../services/signUp"
import { useUser } from "@/stores/user"

const formSchema = z.object({
  fullName: z.string().nonempty("Vui lòng điền vào mục này."),
  password: z
    .string()
    .nonempty("Vui lòng điền vào mục này.")
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
      "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số.",
    ),
})

interface Props {
  onClose: () => void
}

export default function InforForm({ onClose }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      password: "",
    },
  })

  const { data: dataForm, reset } = useSignUpStore()
  const user = useUser()
  const signUp = useSignUp()

  const onSubmit: SubmitHandler<Omit<SignUpDto, "email">> = (data) => {
    signUp.mutate(
      {
        email: dataForm.email,
        ...data,
      },
      {
        onSuccess: (data) => {
          user.setToken({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          })

          user.setUser(data.user)

          reset()
          onClose()
        },
      },
    )
  }

  return (
    <>
      <DialogHeader className="mt-2">
        <DialogTitle className="text-xl">Tạo tài khoản</DialogTitle>
        <DialogDescription>Cung cấp thông tin bên dưới để hoàn tất đăng ký</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-6">
            <Field name="fullName" placeholder="Họ và tên của bạn" t="input" size="lg" />
            <Field name="password" placeholder="Mật khẩu" t="input" size="lg" />
            <Button className="mt-3" type="submit" size="lg">
              Tạo tài khoản
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
