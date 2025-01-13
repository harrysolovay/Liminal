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
      text: "Threads",
      base: "/threads",
      collapsed: false,
      link: "/",
      items: [
        { text: "Messages", link: "/messages" },
        { text: "Branches", link: "/branches" },
        { text: "Models", link: "/models" },
        { text: "Events", link: "/events" },
        { text: "Tools", link: "/tools" },
        { text: "Stepping", link: "/stepping" },
      ],
    },
    {
      text: "Types",
      base: "/types",
      collapsed: false,
      link: "/",
      items: [
        { text: "Intrinsics", link: "/intrinsics" },
        { text: "Utilities", link: "/utilities" },
        { text: "Codecs", link: "/codecs" },
        { text: "Recursion", link: "/recursion" },
        { text: "Meta", link: "/meta" },
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
