import { transformerTwoslash } from "@shikijs/vitepress-twoslash"
import { defineConfig } from "vitepress"
import { LIB_DESCRIPTION } from "../../constants.ts"

export default defineConfig({
  title: "Structured Outputs TS",
  description: LIB_DESCRIPTION,
  markdown: {
    codeTransformers: [transformerTwoslash()],
  },
  sitemap: {
    hostname: "http://structured-outputs.dev",
  },
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  themeConfig: {
    editLink: {
      pattern: "https://github.com/harrysolovay/structured-outputs/edit/main/docs/:path",
    },
    nav: [{
      text: "Manual",
      link: "/",
    }],
    search: {
      provider: "local",
    },
    sidebar: {
      "/": {
        base: "",
        items: [{
          text: "", // For now
          collapsed: false,
          items: [
            { text: "Overview", link: "/" },
            { text: "Quickstart", link: "quickstart" },
            { text: "Types", link: "types" },
            { text: "Context", link: "context" },
            { text: "Patterns", link: "patterns" },
            { text: "Common Errors", link: "common-errors" },
          ],
        }],
      },
    },
    socialLinks: [{
      icon: "github",
      link: "https://github.com/harrysolovay/structured-outputs",
    }],
  },
})
