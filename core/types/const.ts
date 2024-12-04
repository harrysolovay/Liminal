import { Type } from "../Type.ts"

export { const_ as const }
export function const_<V extends number | string>(value: V): Type<V> {
  return Type({
    name: "const",
    factory: const_,
    args: [value],
    argsLookup: { value },
  })
}
Object.defineProperty(const_, "name", { value: "const" })
