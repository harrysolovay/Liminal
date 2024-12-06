import { Type } from "../Type.ts"

export const string: Type<string> = Type({
  kind: "string",
  getAtom: () => string,
})
