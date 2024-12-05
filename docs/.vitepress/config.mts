import { transformerTwoslash } from "@shikijs/vitepress-twoslash"
import dedent from "dedent"
import footnotePlugin from "markdown-it-footnote"
import { DefaultTheme, defineConfig } from "vitepress"
import denoConfig from "../../deno.json" with { type: "json" }

// cspell:disable
const GOOGLE_ANALYTICS = dedent`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-0VS5ZGHX74');
`
// cspell:enable
const x = "asdfasdf"

export default defineConfig({
  title: "Structured Outputs TS",
  description: denoConfig.description,
  markdown: {
    codeTransformers: [transformerTwoslash()],
    theme: {
      dark: "github-dark",
      light: "github-light",
    },
    config: (md) => md.use(footnotePlugin),
  },
  sitemap: {
    hostname: "http://structured-outputs.dev",
  },
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  head: [
    ["link", { rel: "preconnect", link: "https://fonts.googleapis.com" }],
    ["link", { rel: "preconnect", link: "https://fonts.gstatic.com", crossorigin: "" }],
    ["link", {
      rel: "stylesheet",
      link:
        "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
      crossorigin: "",
    }],
    ["script", { async: "", src: "https://www.googletagmanager.com/gtag/js?id=G-0VS5ZGHX74" }],
    ["script", {}, GOOGLE_ANALYTICS],
  ],
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
        text: "Examples",
        link: "/examples",
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
    footer: { // TODO: get this rendering
      message:
        `Released under the <a href="https://github.com/harrysolovay/structured-outputs/blob/main/LICENSE">Apache 2.0 License</a>.`,
      copyright: `Copyright © 2024-present <a href="https://x.com/harrysolovay">Harry Solovay</a>`,
    },
  },
})

function manualItems(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "Introduction",
      items: [
        { text: "Overview", link: "/" },
        { text: "Setup", link: "/setup" },
        { text: "Quickstart", link: "/quickstart" },
      ],
    },
    {
      text: "Types",
      base: "/types",
      collapsed: false,
      items: [
        { text: "Types Overview", link: "/" },
        { text: "Primitives", link: "/primitives" },
        { text: "Collections", link: "/collections" },
        { text: "Unions", link: "/unions" },
        { text: "<code>T.Intersection</code>", link: "/intersection" },
        { text: "Recursion", link: "/recursion" },
        { text: "<code>T.Transform</code>", link: "/transform" },
        { text: "<code>T.Derived</code>", link: "/derived" },
        { text: "Dynamic Types", link: "/dynamic" },
        { text: "<code>T.MetaType</code>", link: "/metatype" },
      ],
    },
    {
      text: "Context",
      base: "/context",
      collapsed: false,
      items: [
        { text: "Context Composition", link: "/composition" },
        { text: "Context Parameters", link: "/parameters" },
      ],
    },
    {
      text: "Consuming Types",
      base: "/consumers",
      collapsed: false,
      items: [
        { text: "<code>ResponseFormat</code>", link: "/response-format" },
        { text: "<code>refine</code>", link: "/refine" },
        { text: "<code>AssertAdherence</code>", link: "/assert-adherence" },
        { text: "<code>TokenAllowance</code>", link: "/token-allowance" },
        { text: "<code>TypeVisitor</code>", link: "/type-visitor" },
        { text: "<code>Tool</code> (Realtime)", link: "/tool" },
      ],
    },
    {
      text: "XYZ",
      base: "/xyz",
      collapsed: false,
      items: [
        { text: "Conventions", link: "/conventions" },
        { text: "Troubleshooting", link: "/troubleshooting" },
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
