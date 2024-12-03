import { Type } from "../../core/mod.ts"

export const number: Type<number> = Type({
  getType: () => number,
})
