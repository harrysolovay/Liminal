import { declareType } from "../declareType.ts"
import type { Type } from "../Type.ts"

export const integer: Type<number> = declareType({
  type: "integer",
  self() {
    return integer
  },
})
