import { transformerTwoslash } from "@shikijs/vitepress-twoslash"
import { DefaultTheme, defineConfig } from "vitepress"
import { description } from "../../deno.json" with { type: "json" }

export default defineConfig({
  title: "Structured Outputs TS",
  description,
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
      "/examples/": {
        base: "",
        items: examplesItems(),
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
      text: "Overview",
      link: "/",
      items: [
        { text: "Setup", link: "setup" },
        { text: "Basic Examples", link: "basic-example" },
        { text: "Types" },
      ],
    },
    {
      text: "Types",
      collapsed: false,
      items: [
        { text: "Primitives", link: "primitive-types" },
        { text: "Collections", link: "collection-types" },
        { text: "Transforms", link: "transform-types" },
        { text: "Recursion", link: "recursive-types" },
        { text: "Utility Types", link: "utility-types" },
        { text: "Derivations", link: "derived-types" },
        { text: "Dynamic Types", link: "dynamic-types" },
        { text: "MetaType", link: "metatype" },
      ],
    },
    {
      text: "Context",
      collapsed: false,
      items: [
        { text: "Composition" },
        { text: "Parameterization" },
      ],
    },
    {
      text: "Consuming Types",
      collapsed: false,
      items: [
        { text: "ResponseFormat" },
        { text: "Refined" },
        { text: "Adherence Assertions" },
        { text: "Observability" },
        { text: "Token Allowance" },
        { text: "Type Visitors" },
        { text: "Tool" },
      ],
    },
    {
      text: "Guide XYZ",
      collapsed: false,
      items: [
        { text: "Conventions", link: "conventions" },
        { text: "Iterative Refinement" },
        { text: "Troubleshooting", link: "troubleshooting" },
      ],
    },
  ]
}

function examplesItems(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "Example Group A",
      collapsed: false,
      items: [
        { text: "..." },
      ],
    },
  ]
}
