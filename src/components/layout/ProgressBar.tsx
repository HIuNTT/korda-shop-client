import { useEffect } from "react"
import { useNavigation } from "react-router"
import Nprogress from "nprogress"

Nprogress.configure({ showSpinner: false })

export default function ProgressBar() {
  const navigation = useNavigation()
  const isNavigating = Boolean(navigation.location)

  useEffect(() => {
    if (isNavigating) {
      Nprogress.start()
    } else {
      Nprogress.done()
    }
  }, [isNavigating])

  return null
}
