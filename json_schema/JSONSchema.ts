import { unreachable } from "@std/assert"
import * as I from "../core/intrinsics/mod.ts"
import type { AnyType } from "../core/Type.ts"
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

export function jsonTypeName(type: AnyType): JSONTypeName {
  switch (type.declaration.getAtom?.()) {
    case I.null: {
      return "null"
    }
    case I.boolean: {
      return "boolean"
    }
    case I.number: {
      return "number"
    }
    case I.integer: {
      return "integer"
    }
    case I.string: {
      return "string"
    }
  }
  switch (type.declaration.factory) {
    case I.const: {
      return jsonTypeName(type.declaration.args[0] as AnyType)
    }
    case I.array: {
      return "array"
    }
    case I.object: {
      return "object"
    }
    case I.enum: {
      return "string"
    }
    case I.union: {
      return "union"
    }
    case I.ref: {
      return "ref"
    }
    case I.transform: {
      return jsonTypeName(type.declaration.args[0] as AnyType)
    }
  }
  unreachable()
}
