import * as I from "./intrinsics/mod.ts"
import { TypeVisitor } from "./TypeVisitor.ts"

export const deserialize = TypeVisitor<unknown, unknown>({
  hook(next, value, type) {
    return next(value, type)
  },
  array(value, _1, element): unknown {
    return (value as unknown[]).map((e) => deserialize(e, element))
  },
  object(value, _1, fields): unknown {
    return Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, deserialize((value as never)[k], v)]),
    )
  },
  union(value, _1, ...members): unknown {
    const matched = I.union.match(members, value)!
    return deserialize(value, matched)
  },
  ref(ctx, _1, get): unknown {
    return deserialize(ctx, get())
  },
  transform(ctx, _1, from, f): unknown {
    return f(deserialize(ctx, from))
  },
  fallback(value) {
    return value
  },
})
