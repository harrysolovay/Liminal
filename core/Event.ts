import type { AnyType } from "./Type.ts"

export interface Event<E = any> {
  type: "Event"
  data: E
}

export type ExtractEvent<Y> = [Extract<Y, AnyType>["E"] | Extract<Y, Event>["data"]][0]

export function event<E>(data: E): Event<E> {
  return {
    type: "Event",
    data,
  }
}
