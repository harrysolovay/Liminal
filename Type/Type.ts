import type { MessageLike, Model } from "../Action/mod.ts"
import { Node } from "../Node.ts"
import { value } from "./value.ts"

export interface Type<T = any> extends TypeDeclaration, Node<"Type", T> {
  value(model: Model, messages?: Array<MessageLike>): Promise<T>
}

export interface TypeDeclaration {
  kind: string
  self(): Type | ((...args: any) => Type)
  args?: Array<unknown>
}

export function Type<T>(declaration: TypeDeclaration): Type<T> {
  return Node("Type", Object.assign(declaration, { value }))
}
