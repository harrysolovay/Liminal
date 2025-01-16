import type { MessageLike } from "./Message.ts"
import type { Model } from "./Model.ts"
import type { Thread } from "./Thread.ts"
import type { Type } from "./Type.ts"

export type Action = Model | MessageLike | Type | Thread
