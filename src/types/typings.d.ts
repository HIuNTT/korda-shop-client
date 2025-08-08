declare namespace API {
  interface BaseResponse<T> {
    data: T
    status_code: number
    message: string
  }

  interface BaseGetList<T> {
    items: T[]
    meta: {
      total_count: number
      page_size: number
      total_pages: number
      current_page: number
    }
  }
}
