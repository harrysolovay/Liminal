import type { RuneAction } from "../Rune.ts"
import type { Thread } from "../Thread/Thread.ts"
import type { Type } from "../Type/mod.ts"
import type { Bubble } from "./Bubble.ts"
import type { MessageLike, Messages } from "./Message.ts"
import type { Model } from "./Model.ts"
import type { Reducer } from "./Reduce.ts"
import type { Relay } from "./Relay.ts"

export type Action =
  | Model
  | Relay
  | MessageLike
  | Messages
  | RuneAction<Type | Thread>
  | Reducer
  | Bubble
