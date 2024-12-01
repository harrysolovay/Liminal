import { declareType, type Type } from "../core/mod.ts"

export const number: Type<number> = declareType({
  name: "number",
  source: {
    getType: () => number,
  },
})
