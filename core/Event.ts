import type { AnyType } from "./Type.ts"

export interface Event<E = any> {
  type: "Event"
  data: E
}

export type ExtractEvent<Y> = [Extract<Y, AnyType>["E"] | Extract<Y, Event>["data"]][0]
