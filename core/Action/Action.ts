import type { Rune } from "../Rune.ts"
import type { MessageLike } from "./MessageLike.ts"
import type { Messages } from "./Messages.ts"
import type { Model } from "./Model.ts"
import type { Reducer } from "./Reducer.ts"
import type { Relayer } from "./Relayer.ts"

export type Action =
  | Model
  | Relayer
  | MessageLike
  | Rune
  | Reducer
  | Messages
