import { DialogContent } from "@/components/ui/dialog"
import EmailForm from "./EmailForm"
import OtpForm from "./OtpForm"
import InforForm from "./InforForm"
import { useSignUpStore } from "@/stores/sign-up"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FaFacebook, FaGoogle } from "react-icons/fa"
import { useUser } from "@/stores/user"
import { useGoogleLogin } from "@react-oauth/google"
import { useGoogleLogin as useGoogleAuth } from "../../services/googleLogin"
import { toast } from "sonner"

interface SignUpDialogProps {
  onClose: () => void
  onOpenLogin?: () => void
}

export default function SignUpDialog({ onClose, onOpenLogin }: SignUpDialogProps) {
  const { step, decStep, reset } = useSignUpStore()
  const user = useUser()

  const googleLogin = useGoogleAuth()

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async ({ code }) => {
      const data = await googleLogin.mutateAsync({ code })

      user.setToken({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      })

      user.setUser(data.user)

      onClose()
    },
    onError() {
      toast.error("Không thể đăng nhập bằng Google")
    },
  })

  return (
    <DialogContent onCloseAutoFocus={() => reset()} className="w-full gap-6 p-8 pt-10 sm:max-w-md">
      {step === 0 && <EmailForm />}
      {step === 1 && <OtpForm />}
      {step === 2 && <InforForm onClose={onClose} />}
      {step > 0 && (
        <button
          onClick={() => decStep()}
          type="button"
          className="ring-offset-background focus-visible:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 left-4 rounded-xs opacity-70 transition-opacity outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6"
        >
          <ArrowLeft />
        </button>
      )}
      {step === 0 && (
        <>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:border-t">
            <span className="text-muted-foreground bg-background relative z-10 px-2">
              Hoặc đăng ký với
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              size="lg"
              variant="outline"
              startContent={<FaGoogle />}
              onClick={() => handleGoogleLogin()}
              isLoading={googleLogin.isPending}
            >
              Google
            </Button>
            <Button type="button" size="lg" variant="outline" startContent={<FaFacebook />}>
              Facebook
            </Button>
          </div>
          <div className="text-center text-sm">
            Bạn đã có tài khoản?{" "}
            <span
              onClick={() => (onClose(), onOpenLogin?.())}
              className="text-primary cursor-pointer underline-offset-4 hover:underline"
            >
              Đăng nhập
            </span>
          </div>
        </>
      )}
    </DialogContent>
  )
}
