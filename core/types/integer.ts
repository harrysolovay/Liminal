import { Type } from "../Type.ts"

export const integer: Type<number> = Type({
  type: "integer",
  self() {
    return integer
  },
})
