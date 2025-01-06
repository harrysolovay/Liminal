import { Type } from "../Type.ts"

export { const_ as const }
function const_<T, const A extends T>(valueType: Type<T>, value: A): Type<A> {
  return Type({
    kind: "const",
    self() {
      return const_
    },
    args: [valueType, value],
  })
}
Object.defineProperty(const_, "name", { value: "const" })
