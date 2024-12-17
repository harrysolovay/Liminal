import { unreachable } from "@std/assert"
import * as I from "./intrinsics.ts"
import type { AnyType } from "./Type.ts"

export type Intrinsics = typeof I
export type IntrinsicName = keyof Intrinsics

export function IntrinsicName(type: AnyType): IntrinsicName {
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
      return "const"
    }
    case I.array: {
      return "array"
    }
    case I.object: {
      return "object"
    }
    case I.enum: {
      return "enum"
    }
    case I.union: {
      return "union"
    }
    case I.ref: {
      return "ref"
    }
    case I.transform: {
      return "transform"
    }
  }
  unreachable()
}
