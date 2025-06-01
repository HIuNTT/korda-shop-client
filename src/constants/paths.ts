export const paths = {
  home: {
    path: "/",
    getHref: () => "/",
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
