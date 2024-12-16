import { DefaultTheme } from "vitepress"

export const MANUAL_SIDEBAR: DefaultTheme.SidebarMulti[string] = {
  base: "",
  items: [
    {
      text: "Overview",
      link: "/",
      items: [
        { text: "Getting Started", link: "/getting-started" },
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
        { text: "Pinning", link: "/pinning" },
        { text: "Metadata", link: "/metadata" },
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
