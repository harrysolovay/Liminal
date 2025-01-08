import type { Action } from "./Action.ts"

export interface Bubble<E = any> {
  type: "Bubble"
  data: E
}

export function Bubble<E>(data: E): Bubble<E> {
  return {
    type: "Bubble",
    data,
  }
}

export type ExtractEvent<Y extends Action> = Extract<Y, Bubble>["data"]
