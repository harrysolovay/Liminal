import { Type } from "../Type.ts"

export const boolean: Type<boolean> = Type({
  name: "boolean",
  getAtom: () => boolean,
})
