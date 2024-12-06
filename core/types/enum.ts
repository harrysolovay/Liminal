import { Type } from "../Type.ts"

export { enum_ as enum }
function enum_<K extends string>(...values: Array<K>): Type<K> {
  return Type({
    kind: "enum",
    factory: enum_,
    args: values,
    argsLookup: { values },
  })
}
Object.defineProperty(enum_, "name", { value: "enum" })
