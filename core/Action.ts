import type { Event } from "./Event.ts"
import type { Bubble, MessageLike, Messages, OnMessage, Reduce } from "./Message.ts"
import type { Model } from "./Model.ts"
import type { Tool } from "./Tool.ts"
import type { Complete } from "./Type.ts"

export type Action =
  | Model
  | Tool
  | MessageLike
  | Messages
  | Complete
  | Event
  | Reduce
  | Bubble
  | OnMessage
