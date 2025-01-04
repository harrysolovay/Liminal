import { declareType } from "../declareType.ts"
import type { Type } from "../Type.ts"

export const number: Type<number> = declareType({
  type: "number",
  self() {
    return number
  },
})
