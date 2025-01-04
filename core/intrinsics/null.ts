import { declareType } from "../declareType.ts"
import type { Type } from "../Type.ts"

export { null_ as null }
const null_: Type<null> = declareType({
  type: "null",
  self() {
    return null_
  },
})
