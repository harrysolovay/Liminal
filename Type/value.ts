import { type MessageLike, type Model, normalizeMessageLike } from "../Action/mod.ts"
import { deserialize } from "./deserialize.ts"
import type { Type } from "./Type.ts"

export async function value<T>(
  this: Type<T>,
  model: Model,
  messages?: Array<MessageLike>,
): Promise<T> {
  if (this.kind === "string") {
    return await model
      .complete(normalizeMessageLike([messages, this.description()]))
      .then((v) => v.body as never)
  }
  const schema = await this.schema()
  const message = await model.complete(normalizeMessageLike(messages), schema)
  return deserialize(schema, JSON.parse(message.body)) as never
}
