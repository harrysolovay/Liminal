import { Type } from "../Type.ts"

export const integer: Type<number> = Type({
  name: "integer",
  getAtom: () => integer,
})
