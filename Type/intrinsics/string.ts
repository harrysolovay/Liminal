import { Type } from "../Type.ts"

export const string: Type<string> = Type({
  kind: "string",
  self() {
    return string
  },
})
