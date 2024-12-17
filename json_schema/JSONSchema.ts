import { unreachable } from "@std/assert"
import { L, type PartialType } from "../core/mod.ts"
import type { Expand } from "../util/mod.ts"

export type JSONType = JSONTypes[JSONTypeName]
export type JSONTypeName = keyof JSONTypes
export type JSONTypes = JSONTypes.Make<{
  null: {
    type: "null"
  }
  boolean: {
    type: "boolean"
  }
  integer: {
    type: "integer"
  }
  number: {
    type: "number"
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
    $ref: string
  }
}>
namespace JSONTypes {
  export type Make<T> = {
    [K in keyof T]: Expand<
      T[K] & {
        description?: string
        const?: unknown
      }
    >
  }
}

export function jsonTypeName(type: PartialType): JSONTypeName {
  switch (type.declaration.getAtom?.()) {
    case L.null: {
      return "null"
    }
    case L.boolean: {
      return "boolean"
    }
    case L.number: {
      return "number"
    }
    case L.integer: {
      return "integer"
    }
    case L.string: {
      return "string"
    }
  }
  switch (type.declaration.factory) {
    case L.const: {
      return jsonTypeName(type.declaration.args[0] as PartialType)
    }
    case L.array: {
      return "array"
    }
    case L.object: {
      return "object"
    }
    case L.enum: {
      return "string"
    }
    case L.union: {
      return "union"
    }
    case L.ref: {
      return "ref"
    }
    case L.transform: {
      return jsonTypeName(type.declaration.args[0] as PartialType)
    }
  }
  unreachable()
}
