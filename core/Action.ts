import type { MessageLike } from "./Message.ts"
import type { Model } from "./Model.ts"
import type { System } from "./System.ts"
import type { Thread } from "./Thread.ts"
import type { Type } from "./Type.ts"

export type Action = Model | System | MessageLike | Type | Thread
