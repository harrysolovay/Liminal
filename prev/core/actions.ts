import type { Falsy } from "@std/assert"

export type Action = Falsy | number | string | Event | Reduce

export type ReduceAction<E, Y> = E | Extract<Y, Event>["data"]

export interface Reduce {
  type: "Reduce"
  reducer: Reducer
}
export type Reducer = (messages: Array<string>) => Array<string>
export function reduce(reducer: Reducer): Reduce {
  return {
    type: "Reduce",
    reducer,
  }
}
export interface Event<E = any> {
  type: "Event"
  data: E
}
export function event<E>(data: E): Event<E> {
  return {
    type: "Event",
    data,
  }
}
