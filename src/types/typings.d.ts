declare namespace API {
  interface BaseResponse<T> {
    data: T
    status_code: number
    message: string
  }
}
