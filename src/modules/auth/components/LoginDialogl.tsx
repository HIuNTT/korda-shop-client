import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useGoogleLogin } from "@react-oauth/google"
import { useGoogleLogin as useGoogleAuth } from "../services/googleLogin"
import { toast } from "sonner"
import { Form } from "@/components/ui/form"
import Field from "@/components/core/field"
import { SubmitHandler, useForm } from "react-hook-form"
import { FaFacebook, FaGoogle } from "react-icons/fa"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginDto, useLogin } from "../services/login"
import { useUser } from "@/stores/user"

const formSchema = z.object({
  credential: z.string().nonempty("Vui lòng điền vào mục này."),
  password: z.string().nonempty("Vui lòng điền vào mục này."),
})

interface LoginDialogProps {
  onClose: () => void
  onOpenSignUp?: () => void
}

export default function LoginDialog({ onClose, onOpenSignUp }: LoginDialogProps) {
  const user = useUser()
  const googleLogin = useGoogleAuth()
  const login = useLogin()

  const form = useForm<LoginDto>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      credential: "",
      password: "",
    },
    mode: "onChange",
  })

  const onSubmit: SubmitHandler<LoginDto> = (data) => {
    login.mutate(data, {
      onSuccess: (data) => {
        user.setToken({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })

        user.setUser(data.user)

        onClose()
        form.reset()
      },
    })
  }

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async ({ code }) => {
      const data = await googleLogin.mutateAsync({ code })

      user.setToken({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })

      user.setUser(data.user)

      onClose()
      form.reset()
    },
    onError() {
      toast.error("Không thể đăng nhập bằng Google")
    },
  })

  return (
    <DialogContent
      onCloseAutoFocus={() => form.reset()}
      className="w-full gap-6 p-8 pt-10 sm:max-w-md"
    >
      <DialogHeader>
        <DialogTitle className="text-xl">Đăng nhập</DialogTitle>
        <DialogDescription>Sử dụng tài khoản Korda của bạn</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-6">
            <Field size="lg" t="input" name="credential" placeholder="Email/Số điện thoại" />
            <div className="grid gap-2">
              <Field size="lg" t="password-input" name="password" placeholder="Mật khẩu" />
              <p className="ml-auto cursor-pointer text-sm underline-offset-4 hover:underline">
                Quên mật khẩu?
              </p>
            </div>
            <Button type="submit" isLoading={login.isPending} disabled={!form.formState.isValid}>
              Đăng nhập
            </Button>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:border-t">
              <span className="text-muted-foreground bg-background relative z-10 px-2">
                Hoặc tiếp tục với
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => handleGoogleLogin()}
                isLoading={googleLogin.isPending}
                startContent={<FaGoogle />}
              >
                Google
              </Button>
              <Button type="button" size="lg" variant="outline" startContent={<FaFacebook />}>
                Facebook
              </Button>
            </div>
            <div className="text-center text-sm">
              Bạn mới biết đến Korda?{" "}
              <span
                onClick={() => (onClose(), onOpenSignUp?.())}
                className="text-primary cursor-pointer underline-offset-4 hover:underline"
              >
                Đăng ký
              </span>
            </div>
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}
