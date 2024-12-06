import { Type } from "../Type.ts"

export { const_ as const }
function const_<V extends number | string>(value: V): Type<V> {
  return Type({
    kind: "const",
    factory: const_,
    args: [value],
    argsLookup: { value },
  })
}
Object.defineProperty(const_, "name", { value: "const" })
