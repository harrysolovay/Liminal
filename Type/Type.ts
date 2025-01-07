import type { MessageLike, Model } from "../Action/mod.ts"
import { Node } from "../Node.ts"
import { description } from "./description.ts"
import { Diagnostics } from "./Diagnostics.ts"
import { type Schema, schema } from "./Schema.ts"
import { signature } from "./signature.ts"
import { value } from "./value.ts"

export interface Type<T = any> extends TypeDeclaration, Node<"Type", T> {
  description(): undefined | string
  schema(): Promise<Schema>
  signature(): string
  value(model: Model, messages?: Array<MessageLike>): Promise<T>
}

export interface TypeDeclaration {
  kind: string
  self(): Type | ((...args: any) => Type)
  args?: Array<unknown>
}

export function Type<T>(declaration: TypeDeclaration): Type<T> {
  return Node(
    "Type",
    Object.assign(declaration, {
      schema,
      description,
      signature,
      value,
    }),
  )
}

export namespace Type {
  export function match(types: Array<Type>, value: unknown): undefined | Type {
    types = [...types]
    while (types.length) {
      const member = types.shift()!
      if (!Diagnostics(member, value, true).length) {
        return member
      }
    }
  }
}
