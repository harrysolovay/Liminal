import type { Ty } from "./_base.ts"
import type { ValidRootKey } from "./common.ts"
import { schema } from "./schema.ts"

export type F = {
  type: "function"
  /** The name of the function. */
  name: string
  /** The description of the function. */
  description: string
  /** Parameters of the function in JSON Schema. */
  parameters: unknown
}

export function F<M extends Record<string, Ty>>(
  name: string,
  description: string,
  models: M,
  rootKey: ValidRootKey<M>,
): F {
  return {
    type: "function",
    name,
    description,
    parameters: schema(models, rootKey),
  }
}
