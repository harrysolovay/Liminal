import { Type } from "../Type.ts"

export const string: Type<string> = Type({
  name: "string",
  getAtom: () => string,
})
