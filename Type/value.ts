import { type MessageLike, type Model, normalizeMessageLike } from "../Action/mod.ts"
import type { Type } from "./Type.ts"

export function value<T>(this: Type<T>, model: Model, messages?: Array<MessageLike>): Promise<T> {
  return model.complete(normalizeMessageLike(messages), null!) as never
}
