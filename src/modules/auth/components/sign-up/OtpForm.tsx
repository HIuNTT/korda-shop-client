import Field from "@/components/core/field"
import { Form } from "@/components/ui/form"
import { SubmitHandler, useForm } from "react-hook-form"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCountdown } from "@/hooks/use-countdown"
import { useSignUpStore } from "@/stores/sign-up"
import { useSendVerifyCode, useVerifyCode } from "../../services/verifyCode"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"

const formSchema = z.object({
  code: z.string().nonempty("Vui lòng điền vào mục này."),
})

export default function OtpForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  })

  const { incStep, data: dataForm } = useSignUpStore()

  const sendVerifyCode = useSendVerifyCode()
  const verifyCode = useVerifyCode()

  const { seconds, onRestart, isRunning } = useCountdown(60)

  const onResend = () => {
    sendVerifyCode.mutate(
      { email: dataForm.email },
      {
        onSuccess: () => {
          onRestart()
        },
      },
    )
  }

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    verifyCode.mutate(
      {
        email: dataForm.email,
        code: data.code,
      },
      {
        onSuccess: () => {
          incStep()
        },
      },
    )
  }

  return (
    <>
      <DialogHeader className="mt-2">
        <DialogTitle className="text-xl">Nhập mã xác minh</DialogTitle>
        <DialogDescription>
          Để xác minh quyền sở hữu, vui lòng nhập đoạn mã được gửi đến{" "}
          <span className="font-bold">{dataForm.email}</span>
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-6">
            <Field
              name="code"
              label="Mã xác thực"
              t="input-otp"
              maxLength={6}
              size="lg"
              pattern={REGEXP_ONLY_DIGITS}
              autoFocus
            />
            <Button className="mt-3" type="submit" isLoading={verifyCode.isPending}>
              Xác nhận
            </Button>
            {isRunning && (
              <div className="grid gap-2 text-sm">
                <div>
                  Gửi lại mã sau <span className="text-primary">{`${seconds}s`}</span>
                </div>
                <div className="text-muted-foreground">Mã OTP có hiệu lực trong 10 phút</div>
              </div>
            )}
            {!isRunning && (
              <div className="flex items-center gap-1 text-sm">
                Không nhận được mã?
                {!sendVerifyCode.isPending ? (
                  <span
                    onClick={onResend}
                    className="text-primary cursor-pointer gap-1 underline-offset-4 hover:underline hover:opacity-80"
                  >
                    Gửi lại
                  </span>
                ) : (
                  <Spinner size="sm" />
                )}
              </div>
            )}
          </div>
        </form>
      </Form>
    </>
  )
}
