import { Type } from "../Type.ts"

export { enum_ as enum }
function enum_<V extends Array<string>>(...values: V): Type<V[number]> {
  return Type({
    kind: "enum",
    factory: enum_,
    args: values,
    argsLookup: { values },
  })
}
Object.defineProperty(enum_, "name", { value: "enum" })
