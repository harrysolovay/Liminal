import { Type } from "../Type.ts"

export const string: Type<string, never> = Type({
  kind: "string",
  self() {
    return string
  },
})
