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
      text: "Types",
      base: "/types",
      collapsed: false,
      link: "/",
      items: [
        { text: "Intrinsic Types", link: "/intrinsics" },
        { text: "Utility Types", link: "/utility" },
        { text: "Recursion", link: "/recursion" },
        { text: "Libraries", link: "/libraries" },
        { text: "MetaType", link: "/meta" },
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
      text: "Providers",
      base: "/providers",
      collapsed: false,
      link: "/",
      items: [
        { text: "xAI", link: "/xai" },
        { text: "OpenAI", link: "/openai" },
        { text: "Ollama", link: "/ollama" },
        { text: "Anthropic", link: "/anthropic" },
        { text: "Gemini", link: "/gemini" },
      ],
    },
    {
      text: "Advanced",
      base: "/advanced",
      collapsed: false,
      link: "/",
      items: [
        { text: "Type Visitors", link: "/visitors" },
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
