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
