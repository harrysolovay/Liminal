import type { Adapter, Message, Reducer } from "./Action.ts"
import type { AnyType, Type } from "./Type.ts"

export interface Model {
  type: "Model"
  adapter: Adapter
}

export function* model(adapter: Adapter): Generator<Model, () => void> {
  return yield {
    type: "Model",
    adapter,
  }
}

export interface Tool {
  type: "Tool"
  description: string
  f: (arg: any) => unknown
  param?: AnyType
}

export function* tool<T = never>(
  description: string,
  f: (arg: T) => unknown,
  param?: Type<T, never>,
): Generator<Tool, () => void> {
  return yield {
    type: "Tool",
    description,
    f,
    param,
  }
}

export interface Event<E = any> {
  type: "Event"
  data: E
}

export function* event<E>(data: E): Generator<Event<E>, void> {
  yield {
    type: "Event",
    data,
  }
}

export interface Reduce {
  type: "Reduce"
  reducer: Reducer
}

export function* reduce(reducer: Reducer): Generator<Reduce, Array<Message>> {
  return yield {
    type: "Reduce",
    reducer,
  }
}
