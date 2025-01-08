import { Rune } from "../Rune.ts"
import { description } from "./description.ts"
import { Diagnostics } from "./Diagnostics.ts"
import { type Schema, schema } from "./Schema.ts"
import { signature } from "./signature.ts"

export interface Type<T = any, E = any> extends TypeDeclaration, Rune<"Type", T, E> {
  description(): undefined | string
  schema(): Promise<Schema>
  signature(): string
}

export interface TypeDeclaration {
  kind: string
  self(): Type | ((...args: any) => Type)
  args?: Array<unknown>
}

export function Type<T, E>(declaration: TypeDeclaration): Type<T, E> {
  return Rune("Type", Object.assign(declaration, { schema, description, signature }))
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
