import type { Task } from "../Node.ts"
import type { Thread } from "../Thread/Thread.ts"
import type { Type } from "../Type/mod.ts"
import type { Event } from "./Event.ts"
import type { MessageLike } from "./Message.ts"
import type { Model } from "./Model.ts"
import type { Reduce } from "./Reduce.ts"
import type { Relay } from "./Relay.ts"

export type Action =
  | Model
  | Relay
  | MessageLike
  | Task<Type | Thread>
  | Reduce
  | Event
