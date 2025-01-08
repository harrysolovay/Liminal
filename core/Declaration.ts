import type { State } from "./State.ts"
import type { ThreadDeclaration } from "./Thread.ts"
import type { TypeDeclaration } from "./Type.ts"

export type Declaration = ThreadDeclaration | TypeDeclaration

export interface DeclarationBase<N extends string> {
  type: N
  consume(state: State): Promise<unknown>
}
