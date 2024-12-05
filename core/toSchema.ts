import type { DescriptionArgs } from "./Context.ts"
import * as T from "./T.ts"
import { type AnyType, type Type, typeKey } from "./Type.ts"
import { TypeVisitor } from "./TypeVisitor.ts"

export type Schema = Record<string, unknown>

export function toSchema<T>(type: Type<T>): Schema {
  const $defs: Record<number, Schema> = {}
  const root = visitor.visit({
    args: {},
    ids: new Map(),
    $defs,
  }, type)
  if (!isRootCompatible(root)) {
    return {
      type: "object",
      properties: {
        value: root,
      },
      additionalProperties: false,
      required: ["value"],
      $defs,
    }
  }
  return { ...root, $defs }
}

function isRootCompatible(schema: Schema): boolean {
  return "type" in schema && schema.type === "object"
}

const visitor = new TypeVisitor<{
  args: DescriptionArgs
  ids: Map<AnyType, number>
  $defs: Record<number, undefined | Schema>
}, Schema>()
  .middleware((next, ctx, type, ...factoryArgs) => {
    let defId = ctx.ids.get(type)
    if (defId === undefined) {
      defId = ctx.ids.size
      ctx.ids.set(type, defId)
    }
    if (!(defId in ctx.$defs)) {
      ctx.$defs[defId] = undefined
      const args = { ...ctx.args }
      const description = type[typeKey].ctx.formatDescription(args)
      ctx.$defs[defId] = {
        description,
        ...next({ ...ctx, args }, type, ...factoryArgs),
      }
    }
    return { $ref: `#/$defs/${defId}` }
  })
  .add(T.boolean, () => ({ type: "boolean" }))
  .add(T.integer, () => ({ type: "integer" }))
  .add(T.number, () => ({ type: "number" }))
  .add(T.string, () => ({ type: "string" }))
  .add(T.array, (ctx, _1, element): Schema => ({
    type: "array",
    items: visitor.visit(ctx, element),
  }))
  .add(T.object, (ctx, _0, fields): Schema => {
    const keys = Object.keys(fields)
    return {
      type: "object",
      properties: Object.fromEntries(
        keys.map((k) => [k, visitor.visit(ctx, fields[k]!)]),
      ),
      additionalProperties: false,
      required: keys,
    }
  })
  .add(T.option, (ctx, _1, Some): Schema => ({
    anyOf: [{ type: "null" }, visitor.visit(ctx, Some)],
  }))
  .add(T.enum, (_0, _1, ...members) => ({
    type: "string",
    enum: members,
  }))
  .add(T.taggedUnion, (ctx, _1, tagKey, members): Schema => ({
    discriminator: tagKey,
    anyOf: Object.entries(members).map(([k, v]) => ({
      type: "object",
      properties: {
        [tagKey]: {
          type: "string",
          const: k,
        },
        ...(v === undefined ? {} : { value: visitor.visit(ctx, v) }),
      },
      required: [tagKey, ...v === undefined ? [] : ["value"]],
      additionalProperties: false,
    })),
  }))
  .add(T.transform, (ctx, _0, _1, from): Schema => visitor.visit(ctx, from))
  .add(T.deferred, (ctx, _0, getType): Schema => visitor.visit(ctx, getType()))
