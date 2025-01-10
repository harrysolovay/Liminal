import { Rune } from "../Rune.ts"
import type { Type } from "../Type/Type.ts"

export const string: Type<string> = Rune({
  kind: "Type",
  self: () => string,
})
