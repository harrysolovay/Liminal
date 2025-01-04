import { declareType } from "../declareType.ts"
import type { Type } from "../Type.ts"

export const boolean: Type<boolean> = declareType({
  type: "boolean",
  self() {
    return boolean
  },
})
