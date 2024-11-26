import { number } from "../primitives.ts"

export function Range(from: number, to: number): typeof number {
  return number`A number between ${"from"} and ${"to"}`.fill({ from, to })
}
