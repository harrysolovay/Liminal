import { Context, type Ty } from "./_base.ts"
import type { ValidRootKey } from "./common.ts"

export function schema<M extends Record<string, Ty>>(models: M, rootKey: ValidRootKey<M>): Record<string, unknown> {
  const root = models[rootKey]!
  const ctx = new Context(root, models)
  return Object.assign(root.schema(ctx), {
    $defs: Object.fromEntries(Object.entries(models).map(([k, v]) => [k, v.schema(ctx)])),
  })
}
