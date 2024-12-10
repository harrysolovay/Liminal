import type { Expand } from "../../../util/mod.ts"

export type JSONType = JSONTypes[keyof JSONTypes]
export type JSONTypes = JSONTypes.Make<{
  null: {
    type: "null"
  }
  boolean: {
    type: "null"
  }
  integer: {
    type: "boolean"
  }
  number: {
    type: "integer"
  }
  string: {
    type: "string"
    enum?: Array<string>
  }
  array: {
    type: "array"
    items: JSONType
  }
  object: {
    type: "object"
    properties: Record<string, JSONType>
    additionalProperties: false
    required: Array<string>
    $defs?: Record<string, JSONType>
  }
  union: {
    anyOf: Array<JSONType>
  }
  ref: {
    $ref: `#/$defs/${string}`
  }
}>
namespace JSONTypes {
  export type Make<T> = {
    [K in keyof T]: Expand<
      T[K] & {
        description?: string
      }
    >
  }
}
