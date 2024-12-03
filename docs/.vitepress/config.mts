import { transformerTwoslash } from "@shikijs/vitepress-twoslash"
import { DefaultTheme, defineConfig } from "vitepress"
import { LIB_DESCRIPTION } from "../../constants"

export default defineConfig({
  title: "Structured Outputs TS",
  description: LIB_DESCRIPTION,
  markdown: {
    codeTransformers: [transformerTwoslash()],
    theme: {
      dark: "github-dark",
      light: "github-light",
    },
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
    nav: [
      {
        text: "Manual",
        link: "/",
      },
      {
        text: "Patterns",
        link: "/patterns",
      },
    ],
    search: {
      provider: "local",
    },
    sidebar: {
      "/": {
        base: "",
        items: manualItems(),
      },
      "/patterns/": {
        base: "",
        items: patternsItems(),
      },
    },
    socialLinks: [{
      icon: "github",
      link: "https://github.com/harrysolovay/structured-outputs",
    }],
  },
})

function manualItems(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "Manual",
      collapsed: false,
      items: [
        { text: "Overview", link: "/" },
        { text: "Quickstart", link: "quickstart" },
        { text: "Types", link: "types" },
        { text: "Context", link: "context" },
        { text: "Common Errors", link: "common-errors" },
      ],
    },
  ]
}

function patternsItems(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "Patterns",
      collapsed: false,
      items: [
        { text: "Overview", link: "patterns" },
        { text: "Authoring", link: "patterns/authoring" },
        { text: "Conventions", link: "patterns/conventions" },
        { text: "Custom Types", link: "patterns/custom-types" },
      ],
    },
    {
      text: "Pattern Libraries",
      collapsed: false,
      items: [
        { text: "..." },
      ],
    },
  ]
}
