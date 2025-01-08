import type { Rune } from "../Rune.ts"
import { Type } from "../Type.ts"

export const string: Rune<string, never> = Type("string", () => string)
