import type { PromiseOr } from "../../../util/mod.ts"

function f<Y extends Yield, T>(
  f: (this: ThreadContext) => Generator<Y, T> | AsyncGenerator<Y, T>,
): Thread<Extract<Y, Event>["data"], Exclude<T, void>> {
  return (messages) => {
    const ctx = ThreadContext(messages)
    const gen = f.call(ctx)
    let target: Type | undefined
    let current: IteratorResult<Y, T> | undefined
    return {
      async next() {
        while (true) {
          current = await gen.next(target?.name.toString())
          if (current.done) {
            return {
              done: true,
              value: current.value as never,
            }
          }
          const { value } = current
          if (typeof value === "string") {
            messages.push(value)
          } else if (Array.isArray(value)) {
            messages.push(...(value as Array<never>).flat(Infinity))
          } else {
            switch (value.type) {
              case "type": {
                target = value
                break
              }
              case "reduce": {
                messages = await value.reducer(messages)
                break
              }
              case "event": {
                return {
                  done: false,
                  value: value.data,
                }
              }
            }
          }
        }
      },
      return(value?: unknown) {
        return Promise.resolve({
          done: true,
          value: value as never,
        })
      },
      throw(e) {
        throw e
      },
      [Symbol.asyncIterator]() {
        return this
      },
      async [Symbol.asyncDispose]() {},
      handle(_f) {
        throw 0
      },
    }
  }
}

type MessageLike = string | Array<string> | Array<MessageLike>
type Yield = MessageLike | Type | Event | Reduce

interface Type<N extends string = string> {
  type: "type"
  name: N
}
declare interface TypeGen<N extends string, T> extends Generator<Type<N>, T> {}
declare const string: TypeGen<"string", string>
declare const number: TypeGen<"number", number>
interface Reduce {
  type: "reduce"
  reducer: (messages: Array<string>) => PromiseOr<Array<string>>
}
function reduce(reducer: (messages: Array<string>) => Array<string>): Reduce {
  return {
    type: "reduce",
    reducer,
  }
}
interface Event<D = any> {
  type: "event"
  data: D
}
function event<E>(data: E): Event<E> {
  return {
    type: "event",
    data,
  }
}
interface ThreadInstance<E, T> extends AsyncGenerator<E, T, undefined> {
  handle<E2>(f: (event: E) => E2): ThreadInstance<Exclude<E2, void>, T>
}
interface ThreadContext {
  <E, T>(f: Thread<E, T>): ThreadInstance<E, T>
}
function ThreadContext(messages: Array<string>): ThreadContext {
  return (f) => f([...messages])
}

interface Thread<E, T> {
  (messages: Array<string>): ThreadInstance<E, T>
}

const g = f(async function*() {
  yield "Hello!"
  // const val = yield* string
  // console.log(val)
  yield "Another message"
  yield event("HELLO!")
  yield "Yet another message"
  yield ["More messages", "A", "B", "C"]
  yield reduce((messages) => [...messages, "here"])
  for await (const inner of this(h)) {
    console.log(inner)
  }
  return 2
})

const h = f(function*() {
  yield "Something here."
  // const num = yield* number
  // console.log(num)
  yield "another"
  yield event(1000)
  yield event(1000n)
  return 3
})

for await (const e of g([])) {
  console.log(e)
}
