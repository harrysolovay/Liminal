import * as I from "./intrinsics/mod.ts"
import type { Type } from "./Type.ts"
import { TypeVisitor } from "./TypeVisitor.ts"

export function deserialize<T>(this: Type<T, never>, jsonText: string): T {
  return deserialize_(JSON.parse(jsonText), this) as never
}

export const deserialize_ = TypeVisitor<unknown, unknown>({
  hook(next, value, type) {
    return next(value, type)
  },
  array(value, _1, element): unknown {
    return (value as unknown[]).map((e) => deserialize_(e, element))
  },
  object(value, _1, fields): unknown {
    return Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, deserialize_((value as never)[k], v)]),
    )
  },
  union(value, _1, ...members): unknown {
    const matched = I.union.match(members, value)!
    return deserialize_(value, matched)
  },
  ref(ctx, _1, get): unknown {
    return deserialize_(ctx, get())
  },
  transform(ctx, _1, from, f): unknown {
    return f(deserialize_(ctx, from))
  },
  fallback(value) {
    return value
  },
})
