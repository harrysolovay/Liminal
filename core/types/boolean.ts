import { Type } from "../Type.ts"

export const boolean: Type<boolean> = Type({
  kind: "boolean",
  getAtom: () => boolean,
})
