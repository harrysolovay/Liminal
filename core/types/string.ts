import { Type } from "../Type.ts"

export const string: Type<string> = Type({
  type: "string",
  self() {
    return string
  },
})
