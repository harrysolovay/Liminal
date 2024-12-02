import { Type } from "../Type.ts"

export { enum_ as enum }
function enum_<K extends string>(...members: Array<K>): Type<K> {
  return Type({
    name: "enum",
    source: {
      factory: enum_,
      args: members,
    },
  })
}
Object.defineProperty(enum_, "name", { value: "enum" })
