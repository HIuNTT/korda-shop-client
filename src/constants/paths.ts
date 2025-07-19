export const paths = {
  home: {
    path: "/",
    getHref: () => "/",
  },

  product: {
    path: "/san-pham",
    getHref: () => "/san-pham",
  },

  cart: {
    path: "/gio-hang",
    getHref: () => "/gio-hang",
  },

  order: {
    path: "/dat-hang",
    getHref: () => "/dat-hang",

    success: {
      path: "/thanh-cong",
      getHref: () => "/dat-hang/thanh-cong",
    },

    failure: {
      path: "/that-bai",
      getHref: () => "/dat-hang/that-bai",
    },
  },

  account: {
    root: {
      path: "/tai-khoan",
      getHref: () => "/tai-khoan",
    },
    info: {
      path: "/thong-tin-tai-khoan",
      getHref: () => "/tai-khoan/thong-tin-tai-khoan",
    },
    address: {
      path: "/so-dia-chi",
      getHref: () => "/tai-khoan/so-dia-chi",
    },
    order: {
      path: "/don-hang",
      getHref: () => "/tai-khoan/don-hang",
    },
  },

  admin: {
    home: {
      path: "/admin",
      getHref: () => "/admin",
    },
    order: {
      list: {
        path: "/orders",
        getHref: () => "/admin/orders",
      },
    },
    product: {
      list: {
        path: "/products",
        getHref: () => "/admin/products",
      },
      create: {
        path: "/create",
        getHref: () => "/admin/products/create",
      },
    },
  },
} as const
