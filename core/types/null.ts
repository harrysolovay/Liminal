import { Type } from "../Type.ts"

export { null_ as null }
const null_: Type<null> = Type({
  type: "null",
  self() {
    return null_
  },
})
