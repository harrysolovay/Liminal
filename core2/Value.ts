import { unimplemented } from "../util/unimplemented.ts"
import { bool, BoolSource } from "./bool.ts"
import { Effect, ReplaceVoid } from "./Effect.ts"
import { F } from "./F.ts"
import { Resource } from "./Resource.ts"
import { Struct } from "./Struct.ts"

export type ValueSource = ValueSource.Into | ValueSource.From
export namespace ValueSource {
  export class From {
    readonly source = "From"
    constructor(readonly from: unknown) {}
  }
  export class Into {
    readonly source = "Into"
    constructor(readonly self: Value, readonly intoType: Type) {}
  }
  export class StructField {
    readonly source = "StructField"
    constructor(readonly self: Struct, readonly key: string) {}
  }
}

export type ValueEffect = ValueEffect.Assignment
export namespace ValueEffect {
  export class Assignment<V extends Value = any> extends Effect<never, V> {
    readonly effectName = "Assignment"
    constructor(readonly value: Value, readonly setter: Value.Setter) {
      super()
    }
  }
}

export class Value<
  TypeName extends string = any,
  Source = any,
  Native = any,
  From = any,
  Into extends Value = any,
> {
  static make<TypeName extends string>(typeName: TypeName) {
    return class<Source, Native = never, From = Native, Into extends Value = never>
      extends this<TypeName, Source, Native, From, Into>
    {
      constructor(source: Source) {
        super(typeName, source)
      }
    }
  }

  static from<V extends Value>(this: Type<V>, from: Value.From<V>): V {
    return new this(new ValueSource.From(from))
  }

  static f<V extends Value, Y extends Value, R extends Value | void>(
    this: Type<V>,
    _statements: (value: V) => Generator<Y, R>,
  ): F<V, Y, ReplaceVoid<R>> {
    unimplemented()
  }

  static resource<V extends Value, Y extends Value, R extends Record<string, Value | F>>(
    this: Type<V>,
    _statements: (value: V) => Generator<Y, R>,
  ): Resource<V, Y, R> {
    unimplemented()
  }

  declare ""?: [Native, From, Into]
  protected ctor = this.constructor as never as new(source: Source) => this
  constructor(readonly typeName: TypeName, readonly source: ValueSource | Source) {}

  into<IntoType extends Type<Into>>(intoType: IntoType): Into {
    return new intoType(new ValueSource.Into(this, intoType))
  }

  assign<V extends Value, Y extends Value>(
    this: V,
    setter: Value.Setter<Y, V>,
  ): Effect<never, V> {
    return new ValueEffect.Assignment(this, setter)
  }

  equals<T extends Value>(this: T, ...[inQuestion]: Args<[inQuestion: T]>): bool {
    return new bool(new BoolSource.Equals(this, inQuestion))
  }
}

export namespace Value {
  export type Native<V extends Value> = V extends Value<any, any, infer Native> ? Native : never
  export type From<V extends Value> = V extends Value<any, any, any, infer From> ? From : never
  export type Into<V extends Value> = V extends Value<any, any, any, any, infer Into> ? Into : never
  export type Setter<Y extends Value = any, V extends Value = any> = [
    V | From<V> | ((value: V) => Generator<Y, V>),
  ][0]
}

export type Type<V extends Value = any> = new(source: V["source"]) => V

export type Args<E extends Value[]> = { [K in keyof E]: E[K] | Value.From<E[K]> }
