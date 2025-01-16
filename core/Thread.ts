import type { Rune } from "./Rune.ts"

export * as Thread from "./_threads/mod.ts"

export interface Thread<T = any> extends Rune<"Thread", T> {}
