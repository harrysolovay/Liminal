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

export default defineConfig({
  title: "Liminal",
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
    hostname: "http://liminal.land",
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
      pattern: "https://github.com/harrysolovay/liminal/edit/main/docs/:path",
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
      link: "https://github.com/harrysolovay/liminal",
    }],
    footer: { // TODO: get this rendering
      message:
        `Released under the <a href="https://github.com/harrysolovay/liminal/blob/main/LICENSE">Apache 2.0 License</a>.`,
      copyright: `Copyright © 2024-present <a href="https://x.com/harrysolovay">Harry Solovay</a>`,
    },
  },
})

function manualItems(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "Overview",
      link: "/",
      items: [
        { text: "Setup", link: "/setup" },
        { text: "Quickstart", link: "/quickstart" },
      ],
    },
    {
      text: "<code>Type</code>s",
      base: "/types",
      collapsed: false,
      link: "/",
      items: [
        { text: "Intrinsic Types", link: "/intrinsics" },
        { text: "Utility Types", link: "/utility" },
        { text: "Meta Types", link: "/meta" },
        { text: "Recursion", link: "/recursion" },
        { text: "Libraries", link: "/libraries" },
        { text: "Type Visitors", link: "/visitors" },
      ],
    },
    {
      text: "Annotations",
      base: "/annotations",
      collapsed: false,
      link: "/",
      items: [
        { text: "Descriptions", link: "/descriptions" },
        { text: "Assertions", link: "/assertions" },
        { text: "Metadata", link: "/metadata" },
      ],
    },
    {
      text: "Client",
      base: "/client",
      collapsed: false,
      link: "/",
      items: [
        { text: "<code>ResponseFormats</code>", link: "/sessions" },
        { text: "<code>Session</code>", link: "/sessions" },
        { text: "<code>Adapter</code>", link: "/adapters" },
        { text: "<code>OpenAIAdapter</code>", link: "/adapters" },
      ],
    },
    {
      text: "XYZ",
      base: "/xyz",
      collapsed: false,
      link: "/",
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
