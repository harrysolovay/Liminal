import type { Ty } from "./_base.ts"
import type { ValidRootKey } from "./common.ts"
import { schema } from "./schema.ts"

export type ResponseFormat = {
  type: "json_schema"
  /** The desired return type in JSON Schema. */
  json_schema: {
    name: string
    description: string
    schema: Record<string, unknown>
    strict: true
  }
}

export function ResponseFormat<M extends Record<string, Ty>>(
  name: string,
  description: string,
  models: M,
  rootKey: ValidRootKey<M>,
): ResponseFormat {
  return {
    type: "json_schema",
    json_schema: {
      name,
      description,
      schema: schema(models, rootKey),
      strict: true,
    },
  }
}
