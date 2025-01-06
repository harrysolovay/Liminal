export interface Event<E = any> {
  type: "Event"
  data: E
}

// TODO: does this need [x][0] wrapping?
export type ExtractEvent<Y> = Extract<Y, Event>["data"]

export function event<E>(data: E): Event<E> {
  return {
    type: "Event",
    data,
  }
}
