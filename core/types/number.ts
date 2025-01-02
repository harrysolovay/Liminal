import { Type } from "../Type.ts"

export const number: Type<number> = Type({
  type: "number",
  self() {
    return number
  },
})
