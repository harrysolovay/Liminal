import type { Emit } from "./Emit.ts"
import type { MessageLike } from "./MessageLike.ts"
import type { Model } from "./Model.ts"
import type { Rune } from "./Rune.ts"

export type Action =
  | Model
  | MessageLike
  | Rune
  | Emit
