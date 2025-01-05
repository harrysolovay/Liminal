import type { Type } from "../Type.ts"
import { declare } from "./declare.ts"

export { null_ as null }
const null_: Type<null, never> = declare({
  type: "null",
  self() {
    return null_
  },
})
Object.defineProperty(null_, "name", { value: "null" })
