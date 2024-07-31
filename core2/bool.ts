import { unimplemented } from "../util/unimplemented.ts"
import { Effect } from "./Effect.ts"
import { Value } from "./Value.ts"

export type BoolSource = BoolSource.True | BoolSource.Equals
export namespace BoolSource {
  export class True {
    readonly source = "True"
  }
  export class False {
    readonly source = "True"
  }

  export class Equals {
    readonly source = "Equals"
    constructor(readonly self: Value, readonly inQuestion: Value) {}
  }
}

export type BoolEffect = BoolEffect.Assert
export namespace BoolEffect {
  export class Assert<Y extends Value = any> extends Effect<Y, never> {
    effectName = "Assert"
    constructor(readonly self: bool, readonly message: Y) {
      super()
    }
  }
}

export class bool extends Value.make("bool")<BoolSource, boolean, boolean> {
  static true = new this(new BoolSource.True())
  static false = new this(new BoolSource.False())

  assert<E extends Value>(message: E): Effect<E, never> {
    return new BoolEffect.Assert(this, message)
  }

  if<Y extends Value, R extends Value | void>(_statements: () => Generator<Y, R>) {
    unimplemented()
  }
}
