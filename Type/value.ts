import { type MessageLike, type Model, normalizeMessageLike } from "../Action/mod.ts"
import { object } from "./intrinsics/mod.ts"
import { schema, SchemaContext } from "./schema.ts"
import type { Type } from "./Type.ts"

export async function value<T>(
  this: Type<T>,
  model: Model,
  messages?: Array<MessageLike>,
): Promise<T> {
  if (this.kind === "string") {
    const message = await model.complete(normalizeMessageLike(messages))
    return message.body as never
  }
  const type = this.kind === "object" ? this : object({ root: this })
  const ctx = new SchemaContext()
  const message = await model.complete(
    normalizeMessageLike(messages ?? "Instance of the specified type."),
    schema(type, ctx),
  )
  console.log(ctx.phantoms)
  return JSON.parse(message.body)
}
