import type { Context } from "../Context.ts"
import { ModelNotFoundError } from "../errors.ts"
import type { Rune } from "../Rune.ts"

export async function consumeType(this: Rune, ctx: Context) {
  if (!ctx.model) {
    throw new ModelNotFoundError()
  }
  await ctx.applyPrelude(this)
  if (this.kind === "string") {
    ctx.onMessage(this.description())
  }
  const message = await ctx.model.complete(ctx, this)
  if (this.kind === "string") {
    return message.body
  }
  let parsed = JSON.parse(message.body)
  if (this.kind !== "object") {
    parsed = parsed._lmnl
  }
  return parsed
}
