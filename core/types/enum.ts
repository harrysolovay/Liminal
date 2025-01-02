import { Type } from "../Type.ts"

export { enum_ as enum }
function enum_<V extends Array<string>>(...values: V): Type<V[number]> {
  return Type({
    type: "enum",
    self() {
      return enum_
    },
    args: values.toSorted(),
  })
}
Object.defineProperty(enum_, "name", { value: "enum" })
