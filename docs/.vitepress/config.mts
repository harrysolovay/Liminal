import { transformerTwoslash } from "@shikijs/vitepress-twoslash"
import { DefaultTheme, defineConfig } from "vitepress"

export default defineConfig({
  title: "Liminal Manual",
  description: "A concept DX for zero-knowledge programs in TypeScript.",
  markdown: {
    codeTransformers: [transformerTwoslash()],
  },
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  themeConfig: {
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
    search: { provider: "local" },
    sidebar: {
      "/": {
        base: "",
        items: manualSidebarItems(),
      },
      "/examples/": {
        base: "/examples/",
        items: examplesSidebarItems(),
      },
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/MinaFoundation/Liminal",
      },
    ],
  },
})

function manualSidebarItems(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "Contracts",
      collapsed: false,
      items: [
        { text: "Getting Started", link: "getting-started" },
        { text: "Values", link: "values" },
        { text: "Contracts", link: "contracts" },
        { text: "Effects", link: "effects" },
        { text: "IDs", link: "ids" },
        { text: "Composite Types", link: "composite-types" },
        { text: "Pattern Libraries", link: "pattern-libraries" },
      ],
    },
    {
      text: "Transactions",
      collapsed: false,
      items: [
        { text: "Transactions", link: "transactions" },
        { text: "Clients", link: "clients" },
        { text: "Deploy & Bind", link: "deploy-and-bind" },
      ],
    },
    {
      text: "Misc. Tools",
      collapsed: false,
      items: [
        { text: "Test Signing", link: "test-signing" },
        { text: "Test Runtime", link: "test-runtime" },
        { text: "Liminal AST", link: "ast" },
        { text: "Visitors", link: "visitors" },
      ],
    },
  ]
}

function examplesSidebarItems(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "Escrow",
      items: [
        { text: "Contract", link: "examples/escrow/contract" },
        { text: "Interaction", link: "examples/escrow/interaction" },
      ],
    },
    {
      text: "Fungible Tokens",
      items: [
        { text: "Contract", link: "examples/fungible-tokens/contract" },
        { text: "Interaction", link: "examples/fungible-tokens/interaction" },
      ],
    },
    {
      text: "Non-fungible Tokens",
      items: [
        { text: "Contract", link: "examples/non-fungible-tokens/contract" },
        {
          text: "Interaction",
          link: "examples/non-fungible-tokens/interaction",
        },
      ],
    },
    {
      text: "Multisig Wallet",
      items: [
        { text: "Contract", link: "examples/multisig/contract" },
        { text: "Interaction", link: "examples/multisig/interaction" },
      ],
    },
    {
      text: "Election",
      items: [
        { text: "Contract", link: "examples/election/contract" },
        { text: "Interaction", link: "examples/election/interaction" },
      ],
    },
    {
      text: "Staking",
      items: [
        { text: "Contract", link: "examples/staking/contract" },
        { text: "Interaction", link: "examples/staking/interaction" },
      ],
    },
  ]
}
