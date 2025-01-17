import { Visitor } from "./_Visitor.ts"
import type { Message } from "./Message.ts"
import { Thread } from "./Thread.ts"

export interface Exec<T> extends Iterator<unknown, T, void> {
  value(): Promise<T>
}

export function Exec<T>(thread: Thread<T>): Exec<T> {
  const iterator = visit({
    messages: [],
    system: {},
  }, thread)
  return null!
}

interface ExecState {
  system: Record<string, string>
  messages: Array<Message>
}

const visit = Visitor<typeof Thread, ExecState, Iterator<unknown, unknown>>(Thread, {
  new(state, _1, key, iterator) {
    return iterator
  },
  branch(state, _1, key, iterator) {
    return iterator
  },
  join(state, _1, ...threads) {
    return (function*() {})()
  },
})
