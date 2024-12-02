import { declareType } from "../declareType.ts"
import type { Type } from "../Type.ts"

export const number: Type<number> = declareType({
  name: "number",
  source: {
    getType: () => number,
  },
})
