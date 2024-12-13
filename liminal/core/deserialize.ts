import * as I from "./intrinsics/mod.ts"
import type { AnyType } from "./Type.ts"
import { TypeVisitor } from "./TypeVisitor.ts"

export function deserialize<T>(type: AnyType<T>, jsonText: string): T {
  return applyTransforms(JSON.parse(jsonText), type) as never
}

const applyTransforms = TypeVisitor<unknown, unknown>({
  array(value, _1, element): unknown {
    return (value as unknown[]).map((e) => applyTransforms(e, element))
  },
  object(value, _1, fields): unknown {
    return Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, applyTransforms((value as never)[k], v)]),
    )
  },
  union(value, _1, ...members): unknown {
    const matched = I.union.match(members, value)!
    return applyTransforms(value, matched)
  },
  ref(ctx, _1, get): unknown {
    return applyTransforms(ctx, get())
  },
  transform(ctx, _1, from, f): unknown {
    return f(applyTransforms(ctx, from))
  },
  fallback(value) {
    return value
  },
})
