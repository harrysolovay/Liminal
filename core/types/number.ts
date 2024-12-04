import { Type } from "../Type.ts"

export const number: Type<number> = Type({
  name: "number",
  getAtom: () => number,
})
