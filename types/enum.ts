import { declare, type Type } from "../core/mod.ts"

export { enum_ as enum }
export function enum_<K extends string>(...members: Array<K>): Type.Initial<K> {
  return declare({
    name: "enum",
    source: {
      factory: enum_,
      args: { members },
    },
    subschema: () => ({
      type: "string",
      enum: members,
    }),
  })
}
Object.defineProperty(enum_, "name", { value: "enum" })