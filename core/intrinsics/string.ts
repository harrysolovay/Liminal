import { Rune } from "../Rune.ts"
import { consumeType } from "./_common.ts"

export const string: Rune<string, never> = Rune({
  kind: "string",
  self: () => string,
  consume: consumeType,
})
