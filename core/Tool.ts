import type { AnyType } from "./Type.ts"

export interface Tool {
  type: "Tool"
  description: string
  f: (arg: any) => unknown
  param?: AnyType
}
