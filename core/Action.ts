import type { Event } from "./Event.ts"
import type { MessageLike } from "./Message.ts"
import type { Model } from "./Model.ts"
import type { Reduce } from "./Reduce.ts"
import type { Relay } from "./Relay.ts"
import type { Complete } from "./Type.ts"

export type Action =
  | Complete
  | MessageLike
  | Model
  | Reduce
  | Relay
  | Event

//  | (() => Iterable<Action, void, void>)
