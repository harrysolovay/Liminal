import { Type } from "../../core/mod.ts"

export { enum_ as enum }
function enum_<K extends string>(...members: Array<K>): Type<K> {
  return Type({
    factory: enum_,
    args: members,
  })
}
Object.defineProperty(enum_, "name", { value: "enum" })
