import { encodeBase32 } from "@std/encoding"
import { type MessageLike, type Model, normalizeMessageLike } from "../Action/mod.ts"
import { WeakMemo } from "../util/mod.ts"
import { Deserialization } from "./Deserialization.ts"
import { object } from "./intrinsics/mod.ts"
import { Schema } from "./Schema.ts"
import type { Type } from "./Type.ts"

export async function value<T>(
  this: Type<T>,
  model: Model,
  messages?: Array<MessageLike>,
): Promise<T> {
  if (this.kind === "string") {
    return await model
      .complete(normalizeMessageLike([messages, this.description()]))
      .then((v) => v.body) as never
  }
  const type = this.kind === "object" ? this : object({ _lmnl: this })
  const schemaCtx = Schema(type)
  const message = await model.complete(
    normalizeMessageLike(messages ?? "Instance of the specified type."),
    {
      schema: schemaCtx.jsonType,
      signature: await signatureHashMemo.getOrInit(type),
    },
  )
  const parsed = JSON.parse(message.body)
  const raw = this.kind === "object" ? parsed : parsed._lmnl
  const { deserialized } = Deserialization(schemaCtx, type, raw)
  return deserialized as never
}

const signatureHashMemo: WeakMemo<Type, Promise<string>> = new WeakMemo((type) =>
  crypto.subtle
    .digest("SHA-256", new TextEncoder().encode(type.signature()))
    .then(encodeBase32)
    .then((v) => v.slice(0, -4))
)
