import type { Type } from "../Type.ts"
import { declare } from "./declare.ts"

export const string: Type<string, never> = declare({
  type: "string",
  self() {
    return string
  },
})
