import { transformerTwoslash } from "@shikijs/vitepress-twoslash"
import { defineConfig } from "vitepress"
import { LIB_DESCRIPTION } from "../../constants.ts"

export default defineConfig({
  title: "Structured Outputs TS",
  description: LIB_DESCRIPTION,
  markdown: {
    codeTransformers: [transformerTwoslash()],
  },
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  themeConfig: {
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
            { text: "Setup", link: "setup" },
            { text: "Getting Started", link: "getting-started" },
            { text: "Primitive Types", link: "primitive-types" },
            { text: "Composite Types", link: "composite-types" },
            { text: "Description Composition", link: "description-composition" },
            { text: "Description Injection", link: "description-injection" },
            { text: "Patterns", link: "pattern-libraries" },
            { text: "Advanced Typing", link: "advanced-typing" },
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
