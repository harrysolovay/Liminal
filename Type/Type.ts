import type { Model } from "../Action/Model.ts"
import { Node } from "../Node.ts"

export interface Type<T = any> extends TypeDeclaration, Node<"Type", Type, T> {
  value(model: Model): Promise<T>
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
      value(model: Model) {
        throw 0
      },
    }),
  )
}
