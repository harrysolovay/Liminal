import { type AnyType, declareType, type Type } from "../core/mod.ts"

export function union<M extends Array<AnyType>>(...members: M): Type<
  {
    [K in keyof M]: {
      type: K
      value: M[K]
    }
  }[number],
  M[number]["P"]
> {
  return declareType({
    name: "union",
    source: {
      factory: union,
      args: members,
    },
    visitValue: (value, visit) => visit(value.value, members[value.type]!),
  })
}
