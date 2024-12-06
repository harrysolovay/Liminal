import { Type } from "../Type.ts"

export const number: Type<number> = Type({
  kind: "number",
  getAtom: () => number,
})
