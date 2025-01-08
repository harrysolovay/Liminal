import type { RuneState } from "./RuneState.ts"
import type { ThreadDeclaration } from "./Thread.ts"
import type { TypeDeclaration } from "./Type.ts"

export type RuneDeclaration = ThreadDeclaration | TypeDeclaration

export interface RuneDeclarationBase<N extends string> {
  type: N
  consume(state: RuneState): Promise<unknown>
}
