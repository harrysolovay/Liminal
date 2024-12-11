import type { Type } from "../Type.ts"

export { enum_ as enum }
function enum_<V extends Array<string>>(...values: V): Type<"string", V[number], never> {
  throw 0
}
Object.defineProperty(enum_, "name", { value: "enum" })
