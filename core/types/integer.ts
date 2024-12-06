import { Type } from "../Type.ts"

export const integer: Type<number> = Type({
  kind: "integer",
  getAtom: () => integer,
})
