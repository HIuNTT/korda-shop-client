import { defineConfig, normalizePath, Plugin } from "vite"
import react from "@vitejs/plugin-react-swc"
import tailwindcss from "@tailwindcss/vite"
import tsconfigPaths from "vite-tsconfig-paths"
import { createRequire } from "node:module"
import { dirname, resolve } from "node:path"
import { readFile } from "node:fs/promises"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    tinymceResource({ baseUrl: "tinymce-resource" }),
  ],
})

function tinymceResource({
  baseUrl,
}: {
  /** Public Dir */
  baseUrl: string
}): Plugin {
  const require = createRequire(import.meta.url)
  const tinymceDir = dirname(require.resolve("tinymce"))

  let outDir: string
  let base: string

  return {
    name: "vite-plugin-tinymce-resource",
    configResolved(config) {
      outDir = config.build.outDir
      base = config.base
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlPrefix = normalizePath(`${base}/${baseUrl}/`)
        if (!req.url?.startsWith(urlPrefix)) {
          return next()
        }
        try {
          const url = resolve(tinymceDir, req.url.replace(urlPrefix, ""))
          const content = await readFile(url)

          res.setHeader("Content-Type", "text/css")
          res.end(content)
        } catch (error) {
          res.statusCode = 500
          res.end(`${error}`)
        }
      })
    },
  }
}
