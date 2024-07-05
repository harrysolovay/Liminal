import { Tagged } from "../util/Tagged.ts"
import { unimplemented } from "../util/unimplemented.ts"
import { bool, BoolSource } from "./Bool.ts"
import { Result, Statements } from "./Call.ts"
import { Effect } from "./Effect.ts"
import { EffectStatements } from "./F.ts"
import { PureStatements } from "./Pure.ts"
import { Union, UnionType } from "./Union.ts"

export type Type<V extends Value | void = any> = new(source: any) => V

export class Value<
  Name extends string = any,
  Source = any,
  Native = any,
  From = any,
  Into extends Value = any,
> {
  static make<Name extends string>(name: Name) {
    return class<Source, Native = never, From = Native, Into extends Value = never>
      extends this<Name, Source, Native, From, Into>
    {
      constructor(source: Source | ValueSource) {
        super(name, source)
      }
    }
  }

  static or<F extends Type, O extends Type>(
    this: F,
    or: O,
  ): F extends UnionType<infer M> ? UnionType<M | O> : UnionType<F | O> {
    return Union(this, or) as never
  }

  static new<T extends Value>(this: Type<T>, value?: Value.From<T>): T {
    return new this(new ValueSource.New(value))
  }

  static default<T extends Type>(this: T, _from: Value.Args<[InstanceType<T>]>[0]): T {
    unimplemented()
  }

  declare ""?: [Native, From, Into]
  ctor = this.constructor as never as new(source: Source | ValueSource) => this

  constructor(readonly typeName: Name, readonly source: Source | ValueSource) {}

  apply<T extends Value>(this: T, metadata: unknown): T {
    return new this.ctor(new ValueSource.Apply(this, metadata))
  }

  assign<T extends Value>(_setter: Value.Setter<T>): Effect<never, T> {
    unimplemented()
  }

  into<O extends Into>(into: Type<O>): O {
    return new into(new ValueSource.Into(this))
  }

  equals<T extends Value>(this: T, inQuestion: Value.Args<[T]>[0]): bool {
    return new bool(new BoolSource.Equals(this, inQuestion))
  }

  is<T extends Value, M extends Type<T>>(this: T, match: M): bool {
    return new bool(new BoolSource.Is(this, match))
  }

  match<
    T extends Value,
    M extends Type<T>,
    R extends Result,
    U extends Exclude<T, InstanceType<M>> | R,
  >(
    this: T,
    match: M,
    statements: PureStatements<{}, [InstanceType<M>], R>,
  ): U
  match<
    T extends Value,
    M extends Type<T>,
    Y extends Value,
    R extends Result,
    U extends Exclude<T, InstanceType<M>> | R,
  >(
    this: T,
    match: M,
    statements: EffectStatements<{}, [InstanceType<M>], Y, R>,
  ): Effect<Y, U>
  match<
    T extends Value,
    M extends Type<T>,
    Y extends Value,
    R extends Result,
    U extends Exclude<T, InstanceType<M>> | R,
  >(
    this: T,
    _match: M,
    _statements: Statements<{}, [InstanceType<M>], Y, R>,
  ): U | Effect<Y, U> {
    unimplemented()
  }

  "?"<T extends Value, M extends Type<T>>(
    this: T,
    match: M,
  ): Effect<InstanceType<M>, Exclude<T, InstanceType<M>>>
  "?"<T extends Value, M extends Type<T>, W extends Value>(
    this: T,
    match: M,
    with_: W,
  ): Effect<W, Exclude<T, InstanceType<M>>>
  "?"<T extends Value>(
    this: T,
    _match: Type<T>,
    _maybeWith_?: Value,
  ) {
    return unimplemented()
  }

  encode(): Uint8Array {
    unimplemented()
  }

  static decode<T extends Type>(this: T, _bytes: Uint8Array): InstanceType<T> {
    unimplemented()
  }
}

export declare namespace Value {
  export type From<T> = T extends Value<any, any, any, infer From> ? From : never
  export type Native<T extends Value | void> = T extends Value<any, any, infer N> ? N : undefined
  export type Source<T extends Value> = T extends Value<any, infer S> ? S : never
  export type Args<A extends (Value | undefined)[]> = {
    [K in keyof A]: A[K] extends undefined ? undefined : A[K] | From<A[K]> | Native<A[K]>
  }
  export type Setter<V extends Value = any> = V | From<V> | Native<V> | ((value: V) => V)
  export type PropTypes = Record<any, Type>
  export type Props<F extends PropTypes> = { [K in keyof F]: Args<[InstanceType<F[K]>]>[0] }
  export type PropsResolved<A extends Value.PropTypes> = {
    [K in keyof A]: A[K] extends UnionType<infer M> ? InstanceType<M> : InstanceType<A[K]>
  }
}

export type ValueSource =
  | ValueSource.New
  | ValueSource.Into
  | ValueSource.Field
  | ValueSource.Apply
  | ValueSource.Default
export namespace ValueSource {
  export class New extends Tagged("New") {
    constructor(readonly from: unknown) {
      super()
    }
  }
  export class Into extends Tagged("Into") {
    constructor(readonly into: unknown) {
      super()
    }
  }
  export class Field extends Tagged("Field") {
    constructor(readonly self: Value, readonly key: keyof any) {
      super()
    }
  }
  export class Apply extends Tagged("Apply") {
    constructor(readonly self: Value, readonly metadata: unknown) {
      super()
    }
  }
  export class Default<F extends Type = any> extends Tagged("Default") {
    constructor(readonly factory: F, readonly from: Value.From<F>) {
      super()
    }
  }
}
