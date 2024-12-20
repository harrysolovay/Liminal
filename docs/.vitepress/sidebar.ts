import { DefaultTheme } from "vitepress"

export const MANUAL_SIDEBAR: DefaultTheme.SidebarMulti[string] = {
  base: "",
  items: [
    {
      text: "Overview",
      link: "/",
      items: [
        { text: "Lifecycle", link: "/lifecycle" },
        { text: "Getting Started", link: "/getting-started" },
      ],
    },
    {
      text: "Types",
      base: "/types",
      collapsed: false,
      link: "/",
      items: [
        { text: "Intrinsic", link: "/intrinsics" },
        { text: "Utility", link: "/utility" },
        { text: "Recursion", link: "/recursion" },
        { text: "Meta", link: "/meta" },
        { text: "Visitor", link: "/visitor" },
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
        { text: "Pins", link: "/pins" },
        { text: "Parameters", link: "/parameters" },
      ],
    },
    {
      text: "Client",
      base: "/client",
      collapsed: false,
      link: "/",
      items: [
        { text: "Messages", link: "/messages" },
        { text: "Completions", link: "/completions" },
        { text: "Refinement", link: "/refinement" },
        { text: "Tools", link: "/tools" },
        { text: "Adapters", link: "/adapters" },
      ],
    },
    {
      text: "XYZ",
      base: "/xyz",
      collapsed: false,
      link: "/",
      items: [
        { text: "Concepts", link: "/concepts" },
        { text: "Conventions", link: "/conventions" },
        { text: "Troubleshooting", link: "/troubleshooting" },
      ],
    },
  ],
}

export const EXAMPLES_SIDEBAR: DefaultTheme.SidebarMulti[string] = {
  base: "",
  items: [
    {
      text: "Example Group A",
      collapsed: false,
      items: [
        { text: "..." },
      ],
    },
  ],
}
