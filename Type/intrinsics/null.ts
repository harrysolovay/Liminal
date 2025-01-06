import { Type } from "../Type.ts"

export { null_ as null }
const null_: Type<null> = Type({
  kind: "null",
  self() {
    return null_
  },
})
Object.defineProperty(null_, "name", { value: "null" })
