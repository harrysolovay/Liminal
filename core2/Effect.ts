import { none } from "./none.ts"
import { Value } from "./Value.ts"

export type ReplaceVoid<R extends Value | void> = Extract<
  void extends R ? Exclude<R, void> | none : R,
  Value
>

export abstract class Effect<Y extends Value = any, R extends Value = any>
  implements Generator<Y, R>
{
  declare ""?: [Y, R]

  abstract effectName: string

  // TODO
  declare next: (...args: [] | [unknown]) => IteratorResult<Y, R>
  declare return: (value: R) => IteratorResult<Y, R>
  declare throw: (e: any) => IteratorResult<Y, R>;
  [Symbol.iterator] = null!
}
