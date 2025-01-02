import { Type } from "../Type.ts"

export const boolean: Type<boolean> = Type({
  type: "boolean",
  self() {
    return boolean
  },
})
