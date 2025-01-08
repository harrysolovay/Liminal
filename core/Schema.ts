import type { Rune } from "./Rune.ts"

export interface Schema {
  name: string
  root: Rune
  json: any
}
