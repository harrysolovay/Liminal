import { declareType } from "../declareType.ts"
import type { Type } from "../Type.ts"

export const string: Type<string> = declareType({
  type: "string",
  self() {
    return string
  },
})
